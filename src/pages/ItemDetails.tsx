import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar, Phone, CheckCircle, MessageSquare, Loader2, Send } from 'lucide-react';
import { api } from '../lib/api';
import { Item, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const itemData = await api.getItem(id);
        setItem(itemData);
        
        const commentsData = await api.getComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error("Failed to load item details", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !commentText.trim()) return;
    
    try {
      setSubmittingComment(true);
      const newCommentData = {
        itemId: id,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous User',
        content: commentText.trim(),
      };
      
      const commentId = await api.addComment(newCommentData);
      setComments([...comments, { ...newCommentData, id: commentId, createdAt: new Date().toISOString() }]);
      setCommentText('');
    } catch (err) {
      console.error("Failed to post comment", err);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Item not found</h2>
        <Link to="/explore" className="text-blue-600 hover:underline mt-4 inline-block">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {item.imageUrl && (
              <div className="h-64 sm:h-96 w-full bg-slate-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}
                `}>
                  {item.type}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium uppercase tracking-wider">
                  {item.category}
                </span>
                {item.status === 'resolved' && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{item.title}</h1>
              <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                Posted by <span className="font-medium text-slate-900">{item.authorName}</span> • 
                {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
              
              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-900">Description</h3>
                <p className="whitespace-pre-wrap text-slate-600">{item.fullDescription}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Comments ({comments.length})
            </h3>
            
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-semibold text-slate-900 text-sm">{comment.authorName}</span>
                        <span className="text-xs text-slate-500">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-slate-500 text-center py-4">No comments yet. Be the first to start the conversation.</p>
              )}
            </div>

            {user ? (
              <form onSubmit={handlePostComment} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={submittingComment || !commentText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Please log in to post a comment.</p>
                <Link to="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-4">Key Information</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</p>
                  <p className="text-slate-900 font-medium">{format(new Date(item.date), 'MMMM d, yyyy')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</p>
                  <p className="text-slate-900 font-medium">{item.location.name}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Phone</p>
                  <p className="text-slate-900 font-medium">{item.contactPhone}</p>
                  <p className="text-xs text-slate-500 mt-1">Please reference this RUET L&F post when calling.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Map Location</h3>
            <div className="h-48 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 z-0 relative">
              <MapContainer 
                center={[item.location.lat, item.location.lng]} 
                zoom={17} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[item.location.lat, item.location.lng]} />
              </MapContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
