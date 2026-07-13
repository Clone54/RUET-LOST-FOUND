import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, CheckCircle, ChevronRight, MessageCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { Item } from '../types';

const faqs = [
  { q: "How do I report a lost item?", a: "Create an account or log in, then click on 'Post an Item' and select 'I Lost Something'. Fill in the details and location on the map." },
  { q: "Is this platform only for RUET students?", a: "Yes, this platform is strictly for items lost or found within the RUET campus premises." },
  { q: "How do I contact someone who found my item?", a: "Once you find a matching post, you can call them using the contact number provided in the post details." },
  { q: "What should I do after I get my item back?", a: "If you posted the lost item, go to 'Manage Items' and mark it as 'Resolved' so it stops appearing in active searches." }
];

export function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const [stats, setStats] = useState({ totalItems: 0, resolvedItems: 0, activeItems: 0 });
  const [graphData, setGraphData] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const [statsData, stories, chartData] = await Promise.all([
          api.getHomeStats(),
          api.getSuccessStories(),
          api.getGraphData()
        ]);
        setStats(statsData);
        setSuccessStories(stories);
        setGraphData(chartData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDynamicData();
  }, []);

  const successRate = stats.totalItems > 0 
    ? Math.round((stats.resolvedItems / stats.totalItems) * 100) 
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Lost something at <span className="text-blue-500">RUET?</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            The central hub for RUET students and staff to report lost items and return found belongings. Let's help each other out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/explore?type=lost" 
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
            >
              I Lost Something
            </Link>
            <Link 
              to="/explore?type=found" 
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors shadow-lg"
            >
              I Found Something
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Highlights / Stats Bar */}
      <section className="bg-blue-600 py-6 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-white text-center">
          <div>
            <div className="text-3xl font-serif font-bold">{stats.activeItems}</div>
            <div className="text-blue-200 text-sm font-medium">Active Listings</div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold">{stats.totalItems}</div>
            <div className="text-blue-200 text-sm font-medium">Items Reported</div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold">{stats.resolvedItems}</div>
            <div className="text-blue-200 text-sm font-medium">Successful Returns</div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">A simple, secure, and effective way to manage lost and found items across the RUET campus.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Search & Explore</h3>
              <p className="text-slate-600">Browse through items reported as lost or found by the RUET community.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Pin the Location</h3>
              <p className="text-slate-600">Use our integrated campus map to precisely mark where the item was lost or found.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Secure Handover</h3>
              <p className="text-slate-600">Connect securely via contact info and mark the item as resolved once handed over.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Statistics Section (Recharts) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Making an Impact</h2>
              <p className="text-slate-600 mb-8">
                Our community is actively returning items every day. Check out our recovery statistics over the last 6 months.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="text-3xl font-serif font-bold text-blue-600">{stats.resolvedItems}</div>
                  <div className="text-sm font-medium text-slate-500">Items Returned</div>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="text-3xl font-serif font-bold text-emerald-600">{successRate}%</div>
                  <div className="text-sm font-medium text-slate-500">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData.length > 0 ? graphData : [{ name: 'Jan', found: 0, lost: 0 }]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="found" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFound)" />
                  <Area type="monotone" dataKey="lost" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* 5. Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Recently Resolved</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Check out the latest items that were successfully returned to their owners.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {successStories.length > 0 ? successStories.map((story) => (
              <div key={story.id} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <CheckCircle className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{story.title}</h3>
                  <p className="text-slate-700 text-lg mb-6 line-clamp-3">
                    {story.shortDescription}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase">
                    {story.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{story.authorName}</p>
                    <p className="text-sm text-slate-500">Reported as {story.type}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center text-slate-500 py-8">
                More success stories coming soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-24 bg-blue-600 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Ready to help the community?</h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
          Join thousands of RUETians who are making the campus a better place. Post your lost item or report what you've found.
        </p>
        <Link 
          to="/register" 
          className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-slate-50 transition-colors shadow-lg"
        >
          Create an Account <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </section>

    </div>
  );
}
