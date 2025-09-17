import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { PageLoader } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app immediately with just a visual loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Only try backend initialization if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Initialize backend data in background after UI is loaded
      const initBackgroundData = () => {
        setTimeout(async () => {
          try {
            // Only attempt if fetch is available
            if (typeof fetch === 'undefined') {
              console.warn('Fetch not available, skipping backend initialization');
              return;
            }

            const { api } = await import('./utils/api');
            
            // Quick health check with very short timeout
            Promise.race([
              api.healthCheck(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Quick timeout')), 1500)
              )
            ])
            .then(() => {
              console.log('Backend health check passed');
              // Try to initialize data with timeout
              return Promise.race([
                api.initializeData(),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Init timeout')), 2500)
                )
              ]);
            })
            .then(() => {
              console.log('Backend data initialized successfully');
            })
            .catch(error => {
              if (error.message.includes('timeout')) {
                console.info('✅ App is running in demo mode with local data - no backend required');
              } else {
                console.info('✅ App is running with local data - all features available');
              }
            });
          } catch (error) {
            console.info('App running in local mode - all features available with mock data');
          }
        }, 1500);
      };

      initBackgroundData();
    }

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
      <BackToTop />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
