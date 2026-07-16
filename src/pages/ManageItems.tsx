import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Item } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export function ManageItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    if (!user) return;
    try {
      const data = await api.getUserItems(user.uid);
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch user items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
      alert('Failed to delete item');
    }
  };

  const handleResolve = async (id: string) => {
    if (!confirm('Mark this item as resolved?')) return;
    try {
      await api.updateItemStatus(id, 'resolved');
      setItems(items.map(item => item.id === id ? { ...item, status: 'resolved' } : item));
    } catch (err) {
      console.error("Failed to update status", err);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Manage Your Posts</h1>
          <p className="text-slate-600 mt-1">View, update, or delete your lost & found items.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-4">You haven't posted any items yet.</p>
          <Link 
            to="/add-item" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
              <div className="relative h-48 bg-slate-100 flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize shadow-sm
                    ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}
                  `}>
                    {item.type}
                  </span>
                  {item.status === 'resolved' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-white shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">{format(new Date(item.createdAt), 'MMM d, yyyy')} &bull; {item.category}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.status === 'active' && (
                      <button
                        onClick={() => handleResolve(item.id)}
                        className="text-xs font-medium text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                        title={item.type === 'lost' ? 'Mark as Found' : 'Mark as Handed Over'}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/items/${item.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
