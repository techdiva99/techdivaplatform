import React, { useState } from 'react';
import { 
  Save, X, Plus, Edit, Trash2, Copy, Check, Globe, Lock,
  Code, Briefcase, Baby, Plane, ChefHat, TrendingUp, 
  Palette, Music, Languages, MessageCircle, Share2, Download
} from 'lucide-react';
import { availableAvatars, availableColors, categoryTemplates } from '../../constants';

const ChatbotBuilder = ({ chatbot, onSave, onCancel }) => {
  // Initialize state with existing chatbot data or defaults
  const [botData, setBotData] = useState(chatbot || {
    name: '',
    description: '',
    avatar: '🤖',
    isPublic: true,
    primaryColor: '#ff67c7',
    categories: [],
    responses: {},
    tags: []
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingResponse, setEditingResponse] = useState(null);
  const [errors, setErrors] = useState({});
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!botData.name.trim()) {
      newErrors.name = 'Chatbot name is required';
    }
    
    if (!botData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (botData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(botData);
    } else {
      // Switch to the tab with the first error
      if (errors.name || errors.description) {
        setActiveTab('basic');
      } else if (errors.categories) {
        setActiveTab('categories');
      }
    }
  };

  // Handle adding a category
  const handleAddCategory = (categoryId) => {
    if (!botData.categories.includes(categoryId)) {
      setBotData({
        ...botData,
        categories: [...botData.categories, categoryId],
        responses: {
          ...botData.responses,
          [categoryId]: botData.responses[categoryId] || []
        }
      });
      // Clear category error if it exists
      if (errors.categories) {
        setErrors({ ...errors, categories: null });
      }
    }
  };

  // Handle removing a category
  const handleRemoveCategory = (categoryId) => {
    const newCategories = botData.categories.filter(cat => cat !== categoryId);
    const newResponses = { ...botData.responses };
    delete newResponses[categoryId];
    
    setBotData({
      ...botData,
      categories: newCategories,
      responses: newResponses
    });
    
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  // Handle adding a response
  const handleAddResponse = (categoryId) => {
    const newResponse = {
      id: `resp_${Date.now()}`,
      text: '',
      keywords: []
    };
    
    setBotData({
      ...botData,
      responses: {
        ...botData.responses,
        [categoryId]: [...(botData.responses[categoryId] || []), newResponse]
      }
    });
    
    setEditingResponse(`${categoryId}_${newResponse.id}`);
  };

  // Handle updating a response
  const handleUpdateResponse = (categoryId, responseId, field, value) => {
    setBotData({
      ...botData,
      responses: {
        ...botData.responses,
        [categoryId]: botData.responses[categoryId].map(resp =>
          resp.id === responseId ? { ...resp, [field]: value } : resp
        )
      }
    });
  };

  // Handle deleting a response
  const handleDeleteResponse = (categoryId, responseId) => {
    setBotData({
      ...botData,
      responses: {
        ...botData.responses,
        [categoryId]: botData.responses[categoryId].filter(r => r.id !== responseId)
      }
    });
  };

  // Handle copying share link
  const handleCopyLink = () => {
    const link = `https://techdiva.ai/chat/${botData.id || 'preview'}`;
    navigator.clipboard.writeText(link);
    setShowCopyConfirm(true);
    setTimeout(() => setShowCopyConfirm(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {chatbot ? 'Edit Chatbot' : 'Create New Chatbot'}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center space-x-2 transform hover:scale-105 transition-all"
              >
                <Save className="w-5 h-5" />
                <span>Save Chatbot</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b">
            {['basic', 'categories', 'responses', 'sharing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 font-medium border-b-2 transition-all ${
                  activeTab === tab
                    ? 'text-pink-600 border-pink-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'basic' && (errors.name || errors.description) && (
                  <span className="ml-2 text-red-500">*</span>
                )}
                {tab === 'categories' && errors.categories && (
                  <span className="ml-2 text-red-500">*</span>
                )}
              </button>
            ))}
          </div>
        </div>

                {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6 max-w-3xl">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Avatar
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableAvatars.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setBotData({ ...botData, avatar })}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110 ${
                        botData.avatar === avatar
                          ? 'ring-4 ring-pink-500 ring-offset-2 scale-110'
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                      style={{ backgroundColor: botData.primaryColor + '20' }}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chatbot Name *
                </label>
                <input
                  type="text"
                  value={botData.name}
                  onChange={(e) => {
                    setBotData({ ...botData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="e.g., Career Mentor, Recipe Helper"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={botData.description}
                  onChange={(e) => {
                    setBotData({ ...botData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: null });
                  }}
                  placeholder="Describe what your chatbot does and how it helps users..."
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {botData.description.length}/200 characters
                </p>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setBotData({ ...botData, primaryColor: color })}
                      className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 ${
                        botData.primaryColor === color
                          ? 'ring-4 ring-offset-2 scale-110'
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: color,
                        ringColor: color
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={botData.tags.join(', ')}
                  onChange={(e) => setBotData({ 
                    ...botData, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="e.g., mentorship, indian-culture, wellness"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Tags help users discover your chatbot
                </p>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="max-w-4xl">
              <h3 className="text-lg font-semibold mb-4">Select Topics Your Chatbot Can Discuss *</h3>
              {errors.categories && (
                <p className="mb-4 text-sm text-red-500">{errors.categories}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryTemplates.map(category => {
                  const Icon = category.icon;
                  const isSelected = botData.categories.includes(category.id);
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => 
                        isSelected 
                          ? handleRemoveCategory(category.id)
                          : handleAddCategory(category.id)
                      }
                      className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        isSelected ? 'text-pink-600' : 'text-gray-600'
                      }`} />
                      <p className={`text-sm font-medium ${
                        isSelected ? 'text-pink-700' : 'text-gray-700'
                      }`}>
                        {category.label}
                      </p>
                      {isSelected && (
                        <Check className="w-4 h-4 mx-auto mt-2 text-pink-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Categories Summary */}
              {botData.categories.length > 0 && (
                <div className="mt-8 p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-pink-700 mb-2">
                    Selected Categories ({botData.categories.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {botData.categories.map(catId => {
                      const category = categoryTemplates.find(c => c.id === catId);
                      return category ? (
                        <span
                          key={catId}
                          className="px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-700 border border-pink-300"
                        >
                          {category.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Responses Tab */}
          {activeTab === 'responses' && (
            <div>
              {botData.categories.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">
                    Please select categories first to add responses.
                  </p>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    Go to Categories
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Category Selector */}
                  <div className="flex flex-wrap gap-2 pb-4 border-b">
                    {botData.categories.map(catId => {
                      const category = categoryTemplates.find(c => c.id === catId);
                      if (!category) return null;
                      
                      return (
                        <button
                          key={catId}
                          onClick={() => setSelectedCategory(catId)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedCategory === catId
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.label}
                          <span className="ml-2 text-sm opacity-75">
                            ({(botData.responses[catId] || []).length})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Responses for Selected Category */}
                  {selectedCategory ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">
                          Responses for {categoryTemplates.find(c => c.id === selectedCategory)?.label}
                        </h4>
                        <button
                          onClick={() => handleAddResponse(selectedCategory)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Response</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(botData.responses[selectedCategory] || []).length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 mb-4">No responses yet for this category.</p>
                            <button
                              onClick={() => handleAddResponse(selectedCategory)}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Add your first response
                            </button>
                          </div>
                        ) : (
                          (botData.responses[selectedCategory] || []).map((response, index) => (
                            <div key={response.id} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Response #{index + 1}
                                </span>
                                <button
                                  onClick={() => handleDeleteResponse(selectedCategory, response.id)}
                                  className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                  title="Delete response"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {editingResponse === `${selectedCategory}_${response.id}` ? (
                                <div className="space-y-3">
                                  <textarea
                                    value={response.text}
                                    onChange={(e) => handleUpdateResponse(
                                      selectedCategory, 
                                      response.id, 
                                      'text', 
                                      e.target.value
                                    )}
                                    placeholder="Enter your response..."
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                  <input
                                    type="text"
                                    value={response.keywords.join(', ')}
                                    onChange={(e) => handleUpdateResponse(
                                      selectedCategory,
                                      response.id,
                                      'keywords',
                                      e.target.value.split(',').map(k => k.trim()).filter(k => k)
                                    )}
                                    placeholder="Keywords that trigger this response (comma separated)"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                  <button
                                    onClick={() => setEditingResponse(null)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                  >
                                    Done
                                  </button>
                                </div>
                              ) : (
                                <div onClick={() => setEditingResponse(`${selectedCategory}_${response.id}`)} 
                                     className="cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                  <p className="text-gray-700 mb-2">
                                    {response.text || <span className="text-gray-400 italic">Click to add response text</span>}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {response.keywords.length > 0 ? (
                                      response.keywords.map((keyword, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                          {keyword}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs text-gray-400 italic">No keywords yet</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">
                        Select a category above to manage its responses
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sharing Tab */}
          {activeTab === 'sharing' && (
            <div className="space-y-8 max-w-3xl">
              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                         style={{ borderColor: botData.isPublic ? '#71ffbb' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="privacy"
                      checked={botData.isPublic === true}
                      onChange={() => setBotData({ ...botData, isPublic: true })}
                      className="sr-only"
                    />
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                           style={{ backgroundColor: '#71ffbb20' }}>
                        <Globe className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Public</p>
                        <p className="text-sm text-gray-600">Anyone can discover and chat with your bot</p>
                      </div>
                      {botData.isPublic && <Check className="w-5 h-5 text-green-600 ml-auto" />}
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                         style={{ borderColor: !botData.isPublic ? '#6b7280' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="privacy"
                      checked={botData.isPublic === false}
                      onChange={() => setBotData({ ...botData, isPublic: false })}
                      className="sr-only"
                    />
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                        <Lock className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Private</p>
                        <p className="text-sm text-gray-600">Only people with the link can access</p>
                      </div>
                      {!botData.isPublic && <Check className="w-5 h-5 text-gray-600 ml-auto" />}
                    </div>
                  </label>
                </div>
              </div>

              {/* Sharing Options */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Share Your Chatbot</h3>
                <div className="space-y-4">
                  {/* Direct Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Direct Link
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={`https://techdiva.ai/chat/${botData.id || 'preview'}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg font-mono text-sm"
                      />
                      <button 
                        onClick={handleCopyLink}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        {showCopyConfirm ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Embed Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Embed Code
                    </label>
                    <textarea
                      readOnly
                      value={`<iframe src="https://techdiva.ai/embed/${botData.id || 'preview'}" width="400" height="600" frameborder="0"></iframe>`}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-lg font-mono text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Copy this code to embed the chatbot in your website
                    </p>
                  </div>

                  {/* Share Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share on Social Media
                    </label>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>Twitter</span>
                      </button>
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>Facebook</span>
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code for Mobile
                    </label>
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Download className="w-8 h-8 text-gray-400" />
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotBuilder;