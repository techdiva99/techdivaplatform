import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isRunningFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    setIsInstalled(isRunningStandalone || isRunningFullscreen);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      console.log('🚀 TechDIVA PWA: Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show custom install prompt after user interaction
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 3000); // Show after 3 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ TechDIVA PWA: App was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Analytics event - FIXED: Safe gtag check
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'App Installed'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    console.log('👆 TechDIVA PWA: User clicked install');
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 TechDIVA PWA: User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('✅ TechDIVA PWA: User accepted install');
      // Analytics event - FIXED: Safe gtag check
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install_accepted', {
          event_category: 'PWA',
          event_label: 'Install Accepted'
        });
      }
    } else {
      console.log('❌ TechDIVA PWA: User dismissed install');
      // Analytics event - FIXED: Safe gtag check
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install_dismissed', {
          event_category: 'PWA',
          event_label: 'Install Dismissed'
        });
      }
    }
    
    // Reset the deferred prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // iOS Install Instructions Component
  const IOSInstallInstructions = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 lg:items-center">
      <div className="bg-white rounded-t-3xl lg:rounded-3xl p-6 max-w-md w-full mx-4 lg:max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: '#ff67c7' }}>
            Install TechDIVA™
          </h3>
          <button 
            onClick={handleDismiss}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: '#ff67c7' }}>
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700 mb-4">
            Install TechDIVA™ for the best experience! Access your AI companion instantly.
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
            <p>Tap the <strong>Share</strong> button in Safari</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</div>
            <p>Scroll down and tap <strong>"Add to Home Screen"</strong></p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">3</div>
            <p>Tap <strong>"Add"</strong> to install TechDIVA™</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 text-white rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#ff67c7' }}
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );

  // Android/Chrome Install Prompt Component
  const AndroidInstallPrompt = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:bottom-6 lg:left-6 lg:right-auto lg:max-w-sm lg:rounded-2xl lg:shadow-xl lg:border">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
             style={{ backgroundColor: '#ff67c7' }}>
          <Download className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">
            Install TechDIVA™
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Get the app for faster access and offline features!
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#ff67c7' }}
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  // Desktop Install Prompt Component  
  const DesktopInstallPrompt = () => (
    <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-xl border p-6 z-50 max-w-sm">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
             style={{ backgroundColor: '#0aabde' }}>
          <Monitor className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">
              Install TechDIVA™
            </h3>
            <button 
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Install the TechDIVA™ app for quick access and notifications.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0aabde' }}
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Show appropriate prompt based on platform and availability
  if (showInstallPrompt) {
    if (isIOS) {
      return <IOSInstallInstructions />;
    } else if (deferredPrompt) {
      // Desktop or Android with install prompt available
      const isDesktop = window.innerWidth >= 1024;
      return isDesktop ? <DesktopInstallPrompt /> : <AndroidInstallPrompt />;
    }
  }

  return null;
};

// Hook for manual install trigger
export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setCanInstall(false);
    
    return outcome === 'accepted';
  };

  return { canInstall, promptInstall };
};

export default PWAInstallPrompt;