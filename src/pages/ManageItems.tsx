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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Date Posted</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-xs text-slate-400 flex-shrink-0">
                            No Img
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}
                      `}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium
                        ${item.status === 'resolved' ? 'text-slate-700' : 'text-blue-600'}
                      `}>
                        {item.status === 'resolved' && <CheckCircle className="w-4 h-4" />}
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'active' && (
                          <button
                            onClick={() => handleResolve(item.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip relative group"
                            title={item.type === 'lost' ? 'Mark as Got' : 'Mark as Handed Over'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
