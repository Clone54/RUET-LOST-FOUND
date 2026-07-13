import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';
import { api } from '../lib/api';

export function Footer() {
  const [siteSettings, setSiteSettings] = useState<any>({ 
    logoText: 'RUET L&F',
    aboutText: 'A dedicated platform for RUET students to find lost items and return found items securely.',
    contactEmail: 'support@ruet-lf.com',
    contactPhone: '+880 1234 567890'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getSiteSettings();
        setSiteSettings(settings);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
    
    const handleSettingsUpdated = () => fetchSettings();
    window.addEventListener('settingsUpdated', handleSettingsUpdated);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdated);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-xs">
                {siteSettings.logoText?.charAt(0) || 'R'}
              </div>
              {siteSettings.logoText || 'RUET L&F'}
            </h3>
            <p className="text-sm text-slate-400">
              {siteSettings.aboutText}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-blue-400 transition-colors">Explore Items</Link></li>
              <li><Link to="/add-item" className="hover:text-blue-400 transition-colors">Report Found Item</Link></li>
              <li><Link to="/add-item" className="hover:text-blue-400 transition-colors">Report Lost Item</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>RUET Campus, Rajshahi, BD</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{siteSettings.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{siteSettings.contactPhone}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} {siteSettings.logoText || 'RUET Lost & Found'}. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> by Students
          </p>
        </div>
      </div>
    </footer>
  );
}
