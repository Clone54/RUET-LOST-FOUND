import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../lib/api';
import { Item, ItemType } from '../types';
import { cn } from '../lib/utils';

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as ItemType) || 'all';
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>(initialType);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // If typeFilter is 'all', we don't pass type to API
        const filters: any = {};
        if (typeFilter !== 'all') filters.type = typeFilter;
        if (categoryFilter !== 'all') filters.category = categoryFilter;
        
        const data = await api.getItems(filters);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [typeFilter, categoryFilter]);

  const handleTypeChange = (type: ItemType | 'all') => {
    setTypeFilter(type);
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Explore Items</h1>
          <p className="text-slate-600 mt-1">Find what you've lost, or see what others have found.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/add-item" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Post an Item
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value as any)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="accessories">Accessories</option>
            <option value="keys">Keys</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-10 bg-slate-200 rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No items found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-100 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
                <div className={cn(
                  "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  item.type === 'lost' ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                )}>
                  {item.type}
                </div>
                {item.status === 'resolved' && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-white flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Resolved
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.shortDescription}</p>
                
                <div className="mt-auto space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    <span className="truncate">{item.location.name}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/items/${item.id}`}
                  className="w-full text-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
