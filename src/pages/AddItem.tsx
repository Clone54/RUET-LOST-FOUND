import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../lib/api';
import { uploadImage } from '../lib/upload';
import { useAuth } from '../contexts/AuthContext';
import { LocationSelector } from '../components/LocationSelector';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  type: z.enum(['lost', 'found']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortDescription: z.string().min(10, 'Short description is required (min 10 chars)'),
  fullDescription: z.string().min(20, 'Full description is required (min 20 chars)'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  contactPhone: z.string().min(11, 'Valid phone number is required'),
  locationName: z.string().min(2, 'Location name is required (e.g. Central Library)'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mapLocation, setMapLocation] = useState({ lat: 24.3636, lng: 88.6280 });

  const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'lost',
      category: 'electronics'
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      let imageUrl = '';
      
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (err: any) {
          setErrorMsg(err.message || 'Image upload failed. You can try submitting without an image.');
          setIsSubmitting(false);
          return;
        }
      }

      let newItemId;
      try {
        const createPromise = api.createItem({
          type: data.type,
          title: data.title,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          category: data.category,
          date: new Date(data.date).toISOString(),
          location: {
            lat: mapLocation.lat,
            lng: mapLocation.lng,
            name: data.locationName
          },
          imageUrl,
          contactPhone: data.contactPhone,
          status: 'active',
          authorId: user.uid,
          authorName: user.displayName || 'Anonymous User',
        });
        
        // Add a 10 second timeout for the database operation
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database operation timed out. Please check if your Firestore database is created.')), 10000)
        );
        
        newItemId = await Promise.race([createPromise, timeoutPromise]) as string;
      } catch (dbErr: any) {
        setErrorMsg(dbErr.message || 'Failed to post item. Make sure Firebase is properly configured.');
        setIsSubmitting(false);
        return;
      }

      navigate(`/items/${newItemId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to post item. Make sure Firebase is properly configured.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Report Lost or Found Item</h1>
        
        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
            {errorMsg}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-lg">
            <label className="cursor-pointer relative text-center">
              <input type="radio" value="lost" {...register('type')} className="peer sr-only" />
              <div className="py-2 rounded-md peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-blue-600 font-medium text-slate-500 transition-all">
                I Lost Something
              </div>
            </label>
            <label className="cursor-pointer relative text-center">
              <input type="radio" value="found" {...register('type')} className="peer sr-only" />
              <div className="py-2 rounded-md peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-emerald-600 font-medium text-slate-500 transition-all">
                I Found Something
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                {...register('title')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Black Casio Watch"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
              <input 
                type="text" 
                {...register('shortDescription')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="A brief summary for the listing page..."
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
              <textarea 
                {...register('fullDescription')} 
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Provide details, distinctive marks, brand, etc..."
              />
              {errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  {...register('category')} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="electronics">Electronics</option>
                  <option value="documents">Documents/ID Cards</option>
                  <option value="accessories">Accessories/Bags</option>
                  <option value="keys">Keys</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  {...register('date')} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <input 
                type="tel" 
                {...register('contactPhone')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="01XXXXXXXXX"
              />
              {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
            </div>
            
            <div className="border-t border-slate-200 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Location Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
                  <input 
                    type="text" 
                    {...register('locationName')} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Central Library Ground Floor"
                  />
                  {errors.locationName && <p className="text-red-500 text-xs mt-1">{errors.locationName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pin on RUET Map</label>
                  <LocationSelector 
                    onLocationSelect={(loc) => setMapLocation({ lat: loc.lat, lng: loc.lng })} 
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Image Upload (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...</>
            ) : (
              'Publish Post'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
