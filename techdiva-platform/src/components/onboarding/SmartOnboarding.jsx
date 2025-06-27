import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Check, Sparkles, 
  Briefcase, GraduationCap, Heart, ShoppingBag, 
  Code, Palette, Coffee, Book,
  Calendar, Mail, FileText, Globe, Brain, Zap, Upload, Mic,
  Image, File, Youtube, Linkedin, Twitter, Facebook, Instagram,
  Github, Search, Camera, Video, HardDrive
} from 'lucide-react';

// Import local storage service
import localStorageService from '../../services/localStorageService';

const SmartOnboarding = ({ onComplete, currentUser }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDataSources, setSelectedDataSources] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    youtube: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    github: '',
    website: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    documents: [],
    images: [],
    voice: [],
    videos: []
  });
  const [generatedSuggestions, setGeneratedSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [webSearchTopics, setWebSearchTopics] = useState('');

  // Categories with icons and descriptions
  const categories = [
    { id: 'professional', name: 'Professional', icon: Briefcase, description: 'Work & Career' },
    { id: 'education', name: 'Education', icon: GraduationCap, description: 'Learning & Study' },
    { id: 'personal', name: 'Personal', icon: Heart, description: 'Life & Wellness' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, description: 'Products & Reviews' },
    { id: 'coding', name: 'Coding', icon: Code, description: 'Programming Help' },
    { id: 'creative', name: 'Creative', icon: Palette, description: 'Art & Design' },
    { id: 'lifestyle', name: 'Lifestyle', icon: Coffee, description: 'Daily Living' },
    { id: 'academic', name: 'Academic', icon: Book, description: 'Research & Writing' }
  ];

  // Enhanced data sources
  const dataSources = [
    { id: 'social-media', name: 'Social Media', icon: Globe, description: 'Connect your profiles' },
    { id: 'documents', name: 'Documents', icon: FileText, description: 'Upload files & PDFs' },
    { id: 'voice', name: 'Voice Notes', icon: Mic, description: 'Record or upload audio' },
    { id: 'images', name: 'Images', icon: Image, description: 'Photos & screenshots' },
    { id: 'videos', name: 'Videos', icon: Video, description: 'Video content' },
    { id: 'web-search', name: 'Web Research', icon: Search, description: 'Online presence' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Events & schedule' },
    { id: 'emails', name: 'Emails', icon: Mail, description: 'Email patterns' }
  ];

  // Mock AI suggestions
  const mockSuggestions = {
    professional: [
      { name: 'Career Coach', avatar: '💼', description: 'Professional development advisor', color: '#3b82f6' },
      { name: 'Meeting Assistant', avatar: '📅', description: 'Schedule and notes helper', color: '#8b5cf6' }
    ],
    education: [
      { name: 'Study Buddy', avatar: '📚', description: 'Learning companion', color: '#10b981' },
      { name: 'Research Helper', avatar: '🔬', description: 'Academic research assistant', color: '#06b6d4' }
    ],
    personal: [
      { name: 'Life Coach', avatar: '🌟', description: 'Personal growth guide', color: '#ec4899' },
      { name: 'Wellness Guru', avatar: '🧘', description: 'Health and mindfulness', color: '#f59e0b' }
    ],
    shopping: [
      { name: 'Shopping Assistant', avatar: '🛍️', description: 'Smart shopping helper', color: '#ef4444' },
      { name: 'Deal Finder', avatar: '💰', description: 'Best prices and deals', color: '#84cc16' }
    ],
    coding: [
      { name: 'Code Mentor', avatar: '👨‍💻', description: 'Programming assistant', color: '#6366f1' },
      { name: 'Debug Helper', avatar: '🐛', description: 'Error solving expert', color: '#14b8a6' }
    ],
    creative: [
      { name: 'Creative Muse', avatar: '🎨', description: 'Inspiration generator', color: '#f97316' },
      { name: 'Design Assistant', avatar: '✨', description: 'Design feedback & ideas', color: '#a855f7' }
    ],
    lifestyle: [
      { name: 'Daily Planner', avatar: '📋', description: 'Organize your day', color: '#0ea5e9' },
      { name: 'Recipe Master', avatar: '👨‍🍳', description: 'Cooking companion', color: '#dc2626' }
    ],
    academic: [
      { name: 'Writing Tutor', avatar: '✍️', description: 'Essay and paper helper', color: '#7c3aed' },
      { name: 'Citation Expert', avatar: '📑', description: 'Reference formatting', color: '#0891b2' }
    ]
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleDataSource = (sourceId) => {
    setSelectedDataSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const toggleSuggestion = (suggestion) => {
    setSelectedSuggestions(prev => {
      const exists = prev.find(s => s.name === suggestion.name);
      if (exists) {
        return prev.filter(s => s.name !== suggestion.name);
      }
      return [...prev, suggestion];
    });
  };

  const handleFileUpload = async (type, files) => {
    try {
      const fileList = await Promise.all(
        Array.from(files).map(async (file) => {
          // Upload to local storage
          const uploadedFile = await localStorageService.uploadFile(
            currentUser.id,
            file,
            type
          );
          return uploadedFile;
        })
      );

      setUploadedFiles(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileList]
      }));

      // Show success message
      const fileWord = fileList.length === 1 ? 'file' : 'files';
      alert(`${fileList.length} ${fileWord} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file: ' + error.message);
    }
  };

  // Voice Recording with local storage
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `recording_${Date.now()}.webm`, {
          type: 'audio/webm'
        });
        
        // Upload to local storage
        try {
          const uploadedFile = await localStorageService.uploadFile(
            currentUser.id,
            file,
            'voice'
          );
          
          setUploadedFiles(prev => ({
            ...prev,
            voice: [...prev.voice, uploadedFile]
          }));
          
          alert('Voice recording saved successfully!');
        } catch (error) {
          console.error('Failed to save recording:', error);
          alert('Failed to save recording');
        }
      };

      mediaRecorder.start();
      window.currentMediaRecorder = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (window.currentMediaRecorder && window.currentMediaRecorder.state === 'recording') {
      window.currentMediaRecorder.stop();
      window.currentMediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with all data
    setTimeout(() => {
      const suggestions = [];
      selectedCategories.forEach(categoryId => {
        const categorySuggestions = mockSuggestions[categoryId] || [];
        categorySuggestions.forEach(suggestion => {
          suggestions.push({
            ...suggestion,
            categories: [categoryId],
            enrichedWith: {
              socialMedia: Object.values(socialLinks).filter(link => link).length,
              documents: uploadedFiles.documents.length,
              voice: uploadedFiles.voice.length,
              images: uploadedFiles.images.length
            }
          });
        });
      });
      
      setGeneratedSuggestions(suggestions);
      setIsGenerating(false);
      setCurrentStep(4);
    }, 2000);
  };

  const handleComplete = async () => {
    try {
      // Save social links to local storage
      const savedLinks = [];
      for (const [platform, url] of Object.entries(socialLinks)) {
        if (url && url.trim()) {
          const link = await localStorageService.addSocialLink(
            currentUser.id,
            platform,
            url
          );
          savedLinks.push(link);
        }
      }

      // Prepare onboarding data
      const onboardingData = {
        suggestions: selectedSuggestions,
        socialLinks: savedLinks,
        uploadedFiles: uploadedFiles,
        webSearchTopics,
        categories: selectedCategories,
        dataSources: selectedDataSources
      };

      // Save onboarding preferences to localStorage
      localStorage.setItem(
        `techdiva_onboarding_${currentUser.id}`,
        JSON.stringify({
          categories: selectedCategories,
          dataSources: selectedDataSources,
          webSearchTopics,
          completedAt: new Date().toISOString()
        })
      );

      console.log('Onboarding completed with data:', onboardingData);
      
      // Complete onboarding with selected suggestions
      onComplete(selectedSuggestions);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to save some data, but continuing with onboarding');
      onComplete(selectedSuggestions);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                Smart AI Suggestions
              </h1>
              <p className="text-white/80 mt-1">Let's personalize your chatbot experience</p>
            </div>
            <button
              onClick={() => onComplete([])}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Step 1: Categories - Same as before */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#de790a' }}>
                  What are your interests?
                </h2>
                <p className="text-gray-600">
                  Select categories to help us suggest the perfect chatbots for you
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon 
                        className={`w-8 h-8 mx-auto mb-3 ${
                          isSelected ? 'text-pink-600' : 'text-gray-400'
                        }`} 
                      />
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                      {isSelected && (
                        <Check className="w-5 h-5 text-pink-600 mx-auto mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedCategories.length === 0}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition transform hover:scale-105 flex items-center ${
                    selectedCategories.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg'
                  }`}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Enhanced Data Sources */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#de790a' }}>
                  Connect Your Data Sources
                </h2>
                <p className="text-gray-600">
                  The more you share, the better we can personalize your chatbots
                </p>
              </div>

              {/* Data Source Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {dataSources.map((source) => {
                  const Icon = source.icon;
                  const isSelected = selectedDataSources.includes(source.id);
                  
                  return (
                    <button
                      key={source.id}
                      onClick={() => toggleDataSource(source.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon 
                        className={`w-6 h-6 mx-auto mb-2 ${
                          isSelected ? 'text-pink-600' : 'text-gray-400'
                        }`} 
                      />
                      <h3 className="font-medium text-sm text-gray-800">{source.name}</h3>
                    </button>
                  );
                })}
              </div>

              {/* Social Media Links */}
              {selectedDataSources.includes('social-media') && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-pink-600" />
                    Social Media Profiles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <input
                        type="url"
                        placeholder="YouTube channel URL"
                        value={socialLinks.youtube}
                        onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <input
                        type="url"
                        placeholder="LinkedIn profile URL"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <input
                        type="url"
                        placeholder="Twitter/X profile URL"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-gray-800" />
                      <input
                        type="url"
                        placeholder="GitHub profile URL"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* File Uploads */}
              {selectedDataSources.includes('documents') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-pink-600" />
                    Upload Documents
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload('documents', e.target.files)}
                      className="hidden"
                      id="doc-upload"
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600">Drop files here or click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, TXT (Max 50MB)</p>
                    </label>
                  </div>
                  {uploadedFiles.documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.documents.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Image Uploads */}
              {selectedDataSources.includes('images') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2 text-pink-600" />
                    Upload Images
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload('images', e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600">Drop images here or click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF (Max 50MB)</p>
                    </label>
                  </div>
                  {uploadedFiles.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {uploadedFiles.images.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={file.thumbnail || '/placeholder.jpg'} 
                            alt={file.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center">
                            <p className="text-white text-xs truncate px-1">{file.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Voice Recording */}
              {selectedDataSources.includes('voice') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Mic className="w-5 h-5 mr-2 text-pink-600" />
                    Voice Notes
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-6 py-3 rounded-lg font-medium transition ${
                        isRecording 
                          ? 'bg-red-500 text-white' 
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <div className="inline-block w-3 h-3 bg-white rounded-full animate-pulse mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="inline w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </button>
                    <span className="text-gray-500">or</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload('voice', e.target.files)}
                      className="hidden"
                      id="voice-upload"
                    />
                    <label htmlFor="voice-upload" className="cursor-pointer text-pink-600 hover:text-pink-700">
                      Upload Audio Files
                    </label>
                  </div>
                </div>
              )}

              {/* Web Search Topics */}
              {selectedDataSources.includes('web-search') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-pink-600" />
                    Web Research Topics
                  </h3>
                  <textarea
                    placeholder="Enter topics, keywords, or areas of expertise you'd like us to research about you..."
                    value={webSearchTopics}
                    onChange={(e) => setWebSearchTopics(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-400 resize-none"
                    rows="3"
                  />
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition flex items-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg transition transform hover:scale-105 flex items-center"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generate - Enhanced */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center py-12">
              <div className="mb-8">
                <Brain className="w-20 h-20 mx-auto mb-6 text-purple-600" />
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#de790a' }}>
                  Ready to Generate AI Suggestions!
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  We'll analyze all your data to create highly personalized chatbot suggestions
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold mb-4">Data Summary:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{selectedCategories.length}</p>
                    <p className="text-gray-600">Categories</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{Object.values(socialLinks).filter(l => l).length}</p>
                    <p className="text-gray-600">Social Links</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{uploadedFiles.documents.length}</p>
                    <p className="text-gray-600">Documents</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{uploadedFiles.voice.length}</p>
                    <p className="text-gray-600">Voice Notes</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{uploadedFiles.images.length}</p>
                    <p className="text-gray-600">Images</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{webSearchTopics ? '✓' : '✗'}</p>
                    <p className="text-gray-600">Web Topics</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition flex items-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                
                <button
                  onClick={generateSuggestions}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform transition hover:scale-105 flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing Your Data...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Suggestions
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Suggestions - Same as before but with enrichment info */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#de790a' }}>
                  Your Personalized Chatbot Suggestions
                </h2>
                <p className="text-gray-600">
                  Based on your data, here are chatbots tailored just for you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedSuggestions.map((suggestion, index) => {
                  const isSelected = selectedSuggestions.find(s => s.name === suggestion.name);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleSuggestion(suggestion)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white"
                            style={{ backgroundColor: suggestion.color }}
                          >
                            {suggestion.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{suggestion.name}</h3>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                            {suggestion.enrichedWith && (
                              <div className="flex items-center space-x-2 mt-2">
                                {suggestion.enrichedWith.socialMedia > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {suggestion.enrichedWith.socialMedia} social
                                  </span>
                                )}
                                {suggestion.enrichedWith.documents > 0 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {suggestion.enrichedWith.documents} docs
                                  </span>
                                )}
                                {suggestion.enrichedWith.voice > 0 && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {suggestion.enrichedWith.voice} voice
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-pink-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition flex items-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => onComplete([])}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition"
                  >
                    Skip for Now
                  </button>
                  
                  <button
                    onClick={handleComplete}
                    disabled={selectedSuggestions.length === 0}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition transform hover:scale-105 flex items-center ${
                      selectedSuggestions.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg'
                    }`}
                  >
                    Create {selectedSuggestions.length} Chatbot{selectedSuggestions.length !== 1 ? 's' : ''}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartOnboarding;

// Storage Note Component - Shows where data is stored locally
export const LocalStorageInfo = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
      <HardDrive className="w-5 h-5 mr-2" />
      Local Storage Information
    </h4>
    <ul className="text-sm text-blue-700 space-y-1">
      <li>• <strong>Files & Documents:</strong> Stored in browser's IndexedDB (up to 500MB)</li>
      <li>• <strong>Voice Recordings:</strong> Saved as audio files in local storage</li>
      <li>• <strong>Social Media Links:</strong> Stored as metadata in IndexedDB</li>
      <li>• <strong>Images:</strong> Stored with automatic thumbnail generation</li>
      <li>• <strong>Privacy:</strong> All data stays on your device, no cloud uploads</li>
      <li>• <strong>Access:</strong> View and manage all uploads in Document Manager</li>
    </ul>
  </div>
);