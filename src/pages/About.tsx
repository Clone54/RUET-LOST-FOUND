import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function About() {
  const [siteSettings, setSiteSettings] = useState<any>({ 
    aboutPageText: `Our Mission\n\nThe RUET Lost & Found platform was created with a simple mission: to help students, faculty, and staff quickly recover their lost items and easily return found belongings. Navigating a bustling campus like RUET means things occasionally get misplaced. We're here to ensure those items find their way back home.\n\nHow it Started\n\nBorn out of a student project to address the common problem of scattered "Lost and Found" posts across various informal social media groups. We centralized the process, adding precise campus mapping, structured categories, and secure communication channels.\n\nFor the Community\n\nThis platform thrives on honesty and community support. By participating, you are directly contributing to the well-being and trust within the Rajshahi University of Engineering & Technology campus.`
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getSiteSettings();
        if (settings.aboutPageText) {
          setSiteSettings(settings);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">About RUET Lost & Found</h1>
        <p className="text-xl text-slate-600">Building a stronger, more connected campus community.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none whitespace-pre-wrap">
        {siteSettings.aboutPageText}
      </div>
    </div>
  );
}
