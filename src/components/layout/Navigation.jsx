import React from 'react';
import { Sparkles, Crown, LogOut, User, Folder, Code } from 'lucide-react';
import TechDivaLogo from '../common/TechDivaLogo';

const Navigation = ({ currentUser, onLogout, onShowOnboarding, onShowProfile, onShowDocuments, onShowCodingGame }) => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40 border-b-4" style={{ borderColor: '#0aabde' }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TechDivaLogo size="small" />
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <button 
                onClick={onShowOnboarding}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-50 transition-colors flex items-center space-x-2"
                style={{ color: '#ff67c7' }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Get AI Suggestions</span>
              </button>
              
              {/* Coding Games button - opens Games Gallery */}
              <button 
                onClick={onShowCodingGame}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
                style={{ color: '#0aabde' }}
                title="Explore Coding Games"
              >
                <Code className="w-4 h-4" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Coding</span>
                  <span className="text-xs opacity-75">Games</span>
                </div>
              </button>
              
              {/* Documents button */}
              <button 
                onClick={onShowDocuments}
                className="p-2 rounded-full hover:bg-pink-50 transition-colors" 
                style={{ color: '#ff9671' }}
                title="My Documents"
              >
                <Folder className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-full hover:bg-pink-50 transition-colors" style={{ color: '#ff9671' }}>
                <Crown className="w-5 h-5" />
              </button>
              
              {/* Make the user info clickable to go to profile */}
              <button
                onClick={onShowProfile}
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
                title="View Profile"
              >
                {currentUser.avatar && currentUser.avatar.startsWith('http') ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl text-white font-bold" style={{ backgroundColor: '#ff67c7' }}>
                    {currentUser.avatar || currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium" style={{ color: '#de790a' }}>{currentUser.name}</span>
                <User className="w-4 h-4" style={{ color: '#de790a' }} />
              </button>
              
              <button 
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-red-50 transition-colors text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;