import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Grid, List, Heart, Share2, 
  MessageCircle, Globe, Lock, Crown, ChevronRight, Edit 
} from 'lucide-react';

const ChatbotGallery = ({ chatbots, onSelectBot, onCreateNew, currentUser }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Filter chatbots based on search and filter criteria
  const filteredBots = chatbots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'mine' && bot.userId === currentUser?.id) ||
                         (filter === 'public' && bot.isPublic);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6" style={{ backgroundColor: '#ff67c7' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div>
            <h2 className="text-4xl font-bold mb-2" style={{ color: '#ff67c7' }}>
              Chatbot Gallery
            </h2>
            <p className="text-lg text-gray-700">
              Discover and create amazing AI companions
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-8 py-4 text-white rounded-lg hover:shadow-lg transition-all text-lg transform hover:scale-105"
            style={{ backgroundColor: '#ff67c7' }}
          >
            <Plus className="w-6 h-6" />
            <span>Create New Chatbot</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white rounded-xl p-4 shadow">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" style={{ color: '#0aabde' }} />
            <input
              type="text"
              placeholder="Search chatbots by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-lg"
              style={{ 
                borderColor: '#0aabde',
                focusBorderColor: '#ff67c7',
                focusRingColor: '#ff67c7'
              }}
            />
          </div>
          
          {/* Filter and View Controls */}
          <div className="flex gap-2">
            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-lg cursor-pointer"
              style={{ 
                borderColor: '#ff9671',
                focusRingColor: '#ff9671'
              }}
            >
              <option value="all">All Chatbots</option>
              <option value="mine">My Chatbots</option>
              <option value="public">Public Only</option>
            </select>
            
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-3 border-2 rounded-lg hover:bg-pink-50 transition-colors"
              style={{ borderColor: '#ff67c7' }}
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? 
                <List className="w-6 h-6" style={{ color: '#ff67c7' }} /> : 
                <Grid className="w-6 h-6" style={{ color: '#ff67c7' }} />
              }
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-white">
          <p className="text-lg">
            Showing {filteredBots.length} chatbot{filteredBots.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Chatbot Grid/List */}
        {filteredBots.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">
              No chatbots found matching your criteria.
            </p>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 text-white rounded-lg hover:shadow-lg transition-all"
              style={{ backgroundColor: '#ff67c7' }}
            >
              Create Your First Chatbot
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {filteredBots.map(bot => (
              <ChatbotCard
                key={bot.id}
                bot={bot}
                currentUser={currentUser}
                viewMode={viewMode}
                onSelectBot={onSelectBot}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate ChatbotCard component for better organization
const ChatbotCard = ({ bot, currentUser, viewMode, onSelectBot }) => {
  const isOwner = bot.userId === currentUser?.id;
  
  return (
    <div
      onClick={() => onSelectBot(bot)}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:scale-105 relative group ${
        viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
      }`}
      style={{ borderColor: bot.primaryColor }}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {isOwner ? (
            <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <Edit className="w-4 h-4" style={{ color: bot.primaryColor }} />
              <span className="text-sm font-medium" style={{ color: bot.primaryColor }}>
                Edit Bot
              </span>
            </div>
          ) : (
            <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" style={{ color: bot.primaryColor }} />
              <span className="text-sm font-medium" style={{ color: bot.primaryColor }}>
                Try Bot
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className={viewMode === 'list' ? 'flex items-center flex-1' : ''}>
        {/* Avatar and Privacy */}
        <div className={`${viewMode === 'list' ? 'mr-4' : 'mb-4'} flex items-center ${
          viewMode === 'list' ? '' : 'justify-between'
        }`}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white relative shadow-md"
              style={{ backgroundColor: bot.primaryColor }}
            >
              {bot.avatar}
              {isOwner && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-yellow-900" />
                </div>
              )}
            </div>
            {viewMode === 'list' && (
              <div>
                <h3 className="font-semibold text-lg" style={{ color: bot.primaryColor }}>
                  {bot.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {bot.description}
                </p>
              </div>
            )}
          </div>
          {viewMode === 'grid' && (
            <div className="flex items-center space-x-1">
              {bot.isPublic ? (
                <Globe className="w-4 h-4" style={{ color: '#71ffbb' }} title="Public" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" title="Private" />
              )}
            </div>
          )}
        </div>
        
        {/* Content for Grid View */}
        {viewMode === 'grid' && (
          <>
            <h3 className="font-semibold text-xl mb-2" style={{ color: bot.primaryColor }}>
              {bot.name}
            </h3>
            <p className="text-base text-gray-600 mb-4 line-clamp-2">
              {bot.description}
            </p>
          </>
        )}
      </div>
      
      {/* Stats */}
      <div className={`flex items-center ${
        viewMode === 'list' 
          ? 'space-x-6 ml-auto' 
          : 'justify-between text-base'
      }`}>
        <div className="flex items-center space-x-1">
          <Heart className="w-5 h-5" style={{ color: '#ff67c7' }} />
          <span style={{ color: '#ff67c7' }} className="font-medium">
            {bot.likes}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Share2 className="w-5 h-5" style={{ color: '#0aabde' }} />
          <span style={{ color: '#0aabde' }} className="font-medium">
            {bot.shares}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-5 h-5" style={{ color: '#ff9671' }} />
          <span style={{ color: '#ff9671' }} className="font-medium">
            {bot.responseCount}
          </span>
        </div>
        {viewMode === 'list' && (
          <ChevronRight className="w-5 h-5 ml-4" style={{ color: bot.primaryColor }} />
        )}
      </div>
      
      {/* Tags for Grid View */}
      {viewMode === 'grid' && bot.tags && bot.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {bot.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-sm px-3 py-1 text-white rounded-full"
              style={{ 
                backgroundColor: ['#ff67c7', '#0aabde', '#ff9671'][idx % 3],
                fontSize: '0.75rem'
              }}
            >
              #{tag}
            </span>
          ))}
          {bot.tags.length > 3 && (
            <span className="text-sm px-3 py-1 bg-gray-200 text-gray-600 rounded-full">
              +{bot.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotGallery;