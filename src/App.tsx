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

// Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AddItem } from './pages/AddItem';
import { ManageItems } from './pages/ManageItems';
import { ItemDetails } from './pages/ItemDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
          <Navbar />
          <main className="flex-grow">
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
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
