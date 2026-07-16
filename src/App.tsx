/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthRoute } from './components/AuthRoute';

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Pages - Lazy loaded
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Explore = lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const AddItem = lazy(() => import('./pages/AddItem').then(m => ({ default: m.AddItem })));
const ManageItems = lazy(() => import('./pages/ManageItems').then(m => ({ default: m.ManageItems })));
const ItemDetails = lazy(() => import('./pages/ItemDetails').then(m => ({ default: m.ItemDetails })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add-item" element={
                  <AuthRoute>
                    <AddItem />
                  </AuthRoute>
                } />
                <Route path="/manage-items" element={
                  <AuthRoute>
                    <ManageItems />
                  </AuthRoute>
                } />
                <Route path="/admin" element={
                  <AuthRoute>
                    <AdminDashboard />
                  </AuthRoute>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
