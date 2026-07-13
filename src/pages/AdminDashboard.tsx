import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'settings' | 'users'>('settings');
  const [settings, setSettings] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (user?.email !== 'rlf@ruet.ac.bd') {
      navigate('/');
      return;
    }
    
    const loadData = async () => {
      try {
        let siteSettings = {};
        let allUsers: any[] = [];
        
        try {
          siteSettings = await api.getSiteSettings();
        } catch (e) {
          console.error("Failed to load site settings", e);
        }

        try {
          allUsers = await api.getAllUsers();
        } catch (e: any) {
          console.error("Failed to load users", e);
          if (e?.message?.includes("Missing or insufficient permissions")) {
            console.error("Please update your Firestore Security Rules to allow admins to read the 'users' collection.");
          }
        }
        
        setSettings(siteSettings);
        setUsers(allUsers);
      } catch (e) {
        console.error("Failed to load admin data", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate]);
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateSiteSettings(settings);
      setMessage('Settings updated successfully!');
      
      // Update global document settings if needed, or window reload
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (e) {
      console.error(e);
      setMessage('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading admin dashboard...</div>;
  }
  
  if (user?.email !== 'rlf@ruet.ac.bd') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage site settings and view users.</p>
      </div>
      
      <div className="flex space-x-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 font-medium text-sm transition-colors relative ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Site Settings
          {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Users
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
      </div>
      
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Site Configuration</h2>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Logo Text</label>
              <input
                type="text"
                value={settings.logoText || ''}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone || ''}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About Text (Footer)</label>
              <textarea
                value={settings.aboutText || ''}
                onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About Page Content</label>
              <textarea
                value={settings.aboutPageText || ''}
                onChange={(e) => setSettings({ ...settings, aboutPageText: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Content for the About Us page..."
              />
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((u, i) => (
                  <tr key={u.uid || i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{u.displayName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
