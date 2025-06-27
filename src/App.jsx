import React, { useState, useEffect } from 'react';
import './App.css';

import { initializePWA } from './utils/pwaUtils';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Import components
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/profile/ProfilePage';
import ChatbotGallery from './components/gallery/ChatbotGallery';
import ChatbotBuilder from './components/builder/ChatbotBuilder';
import SmartOnboarding from './components/onboarding/SmartOnboarding';
import ChatInterface from './components/chat/ChatInterface';
import Navigation from './components/layout/Navigation';
import DocumentManager from './components/storage/DocumentManager';
import StorePage from './components/store/StorePage';
import CodingGame from './components/game/CodingGame';
import GamesGallery from './components/game/GamesGallery';

// Import mock data
import { mockDatabase } from './data/mockDatabase';

function App() {
  // State management
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [chatbots, setChatbots] = useState(mockDatabase.chatbots);
  const [editingBot, setEditingBot] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [chattingBot, setChattingBot] = useState(null);
  const [showDocumentManager, setShowDocumentManager] = useState(false);

  // Initialize PWA (moved inside component)
  useEffect(() => {
    initializePWA();
  }, []);

  // Helper function to create chatbot
  const createChatbot = (botData) => {
    const newBot = {
      ...botData,
      id: `bot_${Date.now()}`,
      userId: currentUser.id,
      likes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      responseCount: Object.values(botData.responses || {}).flat().length
    };
    setChatbots(prevChatbots => [...prevChatbots, newBot]);
  };

  // Handle user login
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    
    // Check if new user (no chatbots created yet)
    const isNewUser = chatbots.filter(bot => bot.userId === userData.id).length === 0;
    if (isNewUser) {
      setShowOnboarding(true);
    }
    
    // Navigate to gallery
    setCurrentView('gallery');
  };

  // Handle show login page
  const handleShowLogin = () => {
    setCurrentView('login');
  };

  // Handle show profile
  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  // Handle show store
  const handleShowStore = () => {
    setCurrentView('store');
  };

  // Handle show coding game - now opens Games Gallery
  const handleShowCodingGame = () => {
    setCurrentView('gamesGallery');
  };

  // Handle show games gallery
  const handleShowGamesGallery = () => {
    setCurrentView('gamesGallery');
  };

  // Handle back to home
  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  // Handle opening chat interface from carousel
  const handleOpenChat = (chatbot) => {
    setChattingBot(chatbot);
  };

  // Handle update profile
  const handleUpdateProfile = (updates) => {
    setCurrentUser({ ...currentUser, ...updates });
    // In a real app, you'd save this to a backend
  };

  // Handle show documents
  const handleShowDocuments = () => {
    setShowDocumentManager(true);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (selectedSuggestions) => {
    setShowOnboarding(false);
    if (selectedSuggestions.length > 0) {
      // Create starter bots based on selections
      selectedSuggestions.forEach(suggestion => {
        const newBot = {
          name: suggestion.name,
          description: suggestion.description,
          avatar: suggestion.avatar,
          primaryColor: suggestion.color,
          categories: suggestion.categories,
          isPublic: false,
          tags: ['auto-generated', ...suggestion.categories],
          responses: {}
        };
        
        createChatbot(newBot);
      });
      
      alert(`Creating ${selectedSuggestions.length} personalized chatbots for you!`);
    }
  };

  // Handle create new chatbot
  const handleCreateNew = () => {
    setEditingBot(null);
    setCurrentView('builder');
  };

  // Handle selecting a chatbot
  const handleSelectBot = (bot) => {
    if (bot.userId === currentUser?.id) {
      // If user owns the bot, open editor
      setEditingBot(bot);
      setCurrentView('builder');
    } else {
      // If it's someone else's bot, open chat
      setChattingBot(bot);
    }
  };

  // Handle saving a chatbot
  const handleSaveBot = (botData) => {
    if (editingBot) {
      // Update existing bot
      setChatbots(chatbots.map(bot => 
        bot.id === editingBot.id 
          ? { ...bot, ...botData, lastUpdated: new Date().toISOString() }
          : bot
      ));
    } else {
      // Create new bot
      const newBot = {
        ...botData,
        id: `bot_${Date.now()}`,
        userId: currentUser.id,
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        responseCount: Object.values(botData.responses || {}).flat().length
      };
      setChatbots([...chatbots, newBot]);
    }
    
    // Return to gallery
    setCurrentView('gallery');
    setEditingBot(null);
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Get user's chatbots
  const userChatbots = currentUser 
    ? chatbots.filter(bot => bot.userId === currentUser.id)
    : [];

  // Render different views based on currentView state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* PWA Install Prompt (moved inside component) */}
      <PWAInstallPrompt />
      
      {/* Landing Page View */}
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={handleShowLogin}
          onLogin={handleShowLogin}
          onGoToStore={handleShowStore}
          onOpenChat={handleOpenChat}
          onPlayGames={handleShowGamesGallery}
        />
      )}
      
      {/* Login Page View */}
      {currentView === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
        />
      )}
      
      {/* Store Page View */}
      {currentView === 'store' && (
        <StorePage 
          onBackToHome={handleBackToHome}
          onLogin={handleShowLogin}
        />
      )}
      
      {/* Profile Page View */}
      {currentView === 'profile' && currentUser && (
        <ProfilePage
          user={currentUser}
          onUpdateProfile={handleUpdateProfile}
          onBack={() => setCurrentView('gallery')}
          onLogout={handleLogout}
          userChatbots={userChatbots}
        />
      )}
      
      {/* Gallery View */}
      {currentView === 'gallery' && (
        <>
          <Navigation 
            currentUser={currentUser}
            onLogout={handleLogout}
            onShowOnboarding={() => setShowOnboarding(true)}
            onShowProfile={handleShowProfile}
            onShowDocuments={handleShowDocuments}
            onShowCodingGame={handleShowCodingGame}
          />
          <ChatbotGallery
            chatbots={chatbots}
            onSelectBot={handleSelectBot}
            onCreateNew={handleCreateNew}
            currentUser={currentUser}
          />
        </>
      )}
      
      {/* Games Gallery View */}
      {currentView === 'gamesGallery' && (
        <GamesGallery
          onBack={handleBackToHome}
        />
      )}
      
      {/* Coding Game View */}
      {currentView === 'game' && currentUser && (
        <CodingGame
          currentUser={currentUser}
          onBack={() => setCurrentView('gallery')}
        />
      )}
      
      {/* Builder View */}
      {currentView === 'builder' && (
        <ChatbotBuilder
          chatbot={editingBot}
          onSave={handleSaveBot}
          onCancel={() => {
            setCurrentView('gallery');
            setEditingBot(null);
          }}
        />
      )}
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <SmartOnboarding
          onComplete={handleOnboardingComplete}
          currentUser={currentUser}
        />
      )}
      
      {/* Chat Interface Modal */}
      {chattingBot && (
        <ChatInterface
          chatbot={chattingBot}
          onClose={() => setChattingBot(null)}
        />
      )}
      
      {/* Document Manager Modal */}
      {showDocumentManager && currentUser && (
        <DocumentManager
          userId={currentUser.id}
          userChatbots={chatbots.filter(bot => bot.userId === currentUser.id)}
          onClose={() => setShowDocumentManager(false)}
        />
      )}
    </div>
  );
}

export default App;