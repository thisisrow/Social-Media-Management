import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import { Toaster } from './components/ui/Toaster';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <PostProvider>
          <Dashboard />
        </PostProvider>
      ) : (
        <LoginPage />
      )}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;