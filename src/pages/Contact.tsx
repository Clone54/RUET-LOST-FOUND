import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { api } from '../lib/api';

export function Contact() {
  const [siteSettings, setSiteSettings] = useState<any>({ 
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
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-xl text-slate-600">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Get in Touch</h2>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="student@ruet.ac.bd" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Email</h3>
              <p className="text-slate-600 mt-1">{siteSettings.contactEmail}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Phone</h3>
              <p className="text-slate-600 mt-1">{siteSettings.contactPhone}</p>
              <p className="text-sm text-slate-500 mt-1">Available 9am - 5pm, Sun-Thu</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-start gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Office</h3>
              <p className="text-slate-600 mt-1">Student Welfare Center<br />RUET Campus, Rajshahi 6204<br />Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
