import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GuideSystem from './components/GuideSystem';

// Pages
import Home from './pages/Home';
import LostItems from './pages/LostItems';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AddItem from './pages/AddItem';
import GuardDashboard from './pages/GuardDashboard';
import ItemDetails from './pages/ItemDetails';
import DataAnalysis from './pages/DataAnalysis';

// Toastify for notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/lost-items" element={<LostItems />} />
              <Route path="/lost-items/:id" element={<ItemDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Guard Routes */}
              <Route 
                path="/GuardDashboard" 
                element={
                  <ProtectedRoute requiresGuard>
                    <GuardDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiresGuard>
                    <GuardDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/additem" 
                element={
                  <ProtectedRoute requiresGuard>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-item" 
                element={
                  <ProtectedRoute requiresGuard>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/data-analysis" 
                element={
                  <ProtectedRoute requiresGuard>
                    <DataAnalysis />
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy route for backward compatibility */}
              <Route path="/itemdetails/:id" element={<ItemDetails />} />
              
              {/* Protected Routes (for future implementation) */}
              {/* 
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <GuardDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-item" 
                element={
                  <ProtectedRoute requiresAdmin>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-item/:id" 
                element={
                  <ProtectedRoute>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              */}
            </Routes>
          </main>
          <Footer />
          <GuideSystem />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;