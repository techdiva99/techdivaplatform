import React, { useState, useEffect } from 'react';
import {
  Folder, File, Image, Mic, Video, Link, Trash2, Download,
  Search, Filter, Grid, List, Calendar, ChevronRight,
  Upload, X, Eye, Edit2, Share2, Lock, Globe,
  Youtube, Linkedin, Twitter, Github, Instagram, Facebook,
  FileText, Music, Film, Link2, MoreVertical, Clock,
  HardDrive, Cloud, AlertCircle, CheckCircle, Bot,
  FolderOpen, ArrowLeft, Move
} from 'lucide-react';

// Import local storage service
import localStorageService from '../../services/localStorageService';

const DocumentManager = ({ userId, userChatbots = [], onClose }) => {
  const [view, setView] = useState('folders'); // folders, files, or all
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChatbot, setCurrentChatbot] = useState(null);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedFileToMove, setSelectedFileToMove] = useState(null);
  const [showAllFiles, setShowAllFiles] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId, currentChatbot, showAllFiles]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (view === 'folders' && !currentChatbot) {
        // Load chatbot folders
        const chatbotFolders = await localStorageService.getUserChatbotFolders(userId);
        
        // Create folder info for each chatbot
        const folderData = userChatbots.map(chatbot => {
          const folder = chatbotFolders.find(f => f.chatbotId === chatbot.id) || {
            fileCount: 0,
            totalSize: 0
          };
          
          return {
            id: chatbot.id,
            name: chatbot.name,
            avatar: chatbot.avatar,
            primaryColor: chatbot.primaryColor,
            fileCount: folder.fileCount || 0,
            totalSize: folder.totalSize || 0,
            lastModified: folder.lastModified || chatbot.lastUpdated
          };
        });

        // Add "General Documents" folder for files not assigned to any chatbot
        const generalFiles = await localStorageService.getUserFiles(userId, null);
        const unassignedFiles = generalFiles.filter(f => !f.chatbotId);
        
        folderData.unshift({
          id: 'general',
          name: 'General Documents',
          avatar: '📁',
          primaryColor: '#6b7280',
          fileCount: unassignedFiles.length,
          totalSize: unassignedFiles.reduce((sum, f) => sum + (f.size || 0), 0),
          lastModified: new Date().toISOString()
        });

        setFolders(folderData);
      } else if (showAllFiles || view === 'all') {
        // Load ALL files with chatbot information
        const [allFiles, links, storage] = await Promise.all([
          localStorageService.getUserFiles(userId),
          localStorageService.getUserSocialLinks(userId),
          localStorageService.getUserStorage(userId)
        ]);

        // Add chatbot info to each document
        const documentsWithBotInfo = allFiles.map(file => ({
          ...file,
          chatbotName: file.chatbotId 
            ? userChatbots.find(bot => bot.id === file.chatbotId)?.name || 'Unknown Bot'
            : 'General Documents',
          chatbotAvatar: file.chatbotId
            ? userChatbots.find(bot => bot.id === file.chatbotId)?.avatar || '🤖'
            : '📁',
          chatbotColor: file.chatbotId
            ? userChatbots.find(bot => bot.id === file.chatbotId)?.primaryColor || '#6b7280'
            : '#6b7280'
        }));

        const linksWithBotInfo = links.map(link => ({
          ...link,
          chatbotName: link.chatbotId 
            ? userChatbots.find(bot => bot.id === link.chatbotId)?.name || 'Unknown Bot'
            : 'General Documents',
          chatbotAvatar: link.chatbotId
            ? userChatbots.find(bot => bot.id === link.chatbotId)?.avatar || '🤖'
            : '📁',
          chatbotColor: link.chatbotId
            ? userChatbots.find(bot => bot.id === link.chatbotId)?.primaryColor || '#6b7280'
            : '#6b7280'
        }));

        setDocuments([...documentsWithBotInfo, ...linksWithBotInfo]);
        setStorageUsed(storage.used);
      } else {
        // Load files for specific chatbot
        const chatbotId = currentChatbot === 'general' ? null : currentChatbot;
        const [files, links, storage] = await Promise.all([
          localStorageService.getUserFiles(userId, chatbotId),
          localStorageService.getUserSocialLinks(userId, chatbotId),
          localStorageService.getUserStorage(userId)
        ]);

        // Filter files based on chatbot
        let filteredFiles = files;
        if (currentChatbot === 'general') {
          filteredFiles = files.filter(f => !f.chatbotId);
        } else if (currentChatbot) {
          filteredFiles = files.filter(f => f.chatbotId === currentChatbot);
        }

        const allDocuments = [...filteredFiles, ...links];
        setDocuments(allDocuments);
        setStorageUsed(storage.used);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderId) => {
    setCurrentChatbot(folderId);
    setView('files');
  };

  const handleBackToFolders = () => {
    setCurrentChatbot(null);
    setView('folders');
    setSelectedItems([]);
    setShowAllFiles(false);
  };

  const handleViewAllFiles = () => {
    setShowAllFiles(true);
    setView('all');
    setCurrentChatbot(null);
  };

  const handleFileUpload = async (type, files) => {
    try {
      const uploadPromises = Array.from(files).map(file => 
        localStorageService.uploadFile(userId, file, type, currentChatbot === 'general' ? null : currentChatbot)
      );
      
      await Promise.all(uploadPromises);
      loadData();
      
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files: ' + error.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (item.type === 'social') {
          await localStorageService.deleteSocialLink(item.id);
        } else {
          await localStorageService.deleteFile(item.id, userId);
        }
        
        loadData();
        alert('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleMoveFile = async (fileId, targetChatbotId) => {
    try {
      await localStorageService.moveFileToChatbot(fileId, targetChatbotId === 'general' ? null : targetChatbotId);
      setShowMoveDialog(false);
      setSelectedFileToMove(null);
      loadData();
      alert('File moved successfully!');
    } catch (error) {
      console.error('Error moving file:', error);
      alert('Failed to move file');
    }
  };

  const getCurrentChatbotName = () => {
    if (!currentChatbot) return 'All Documents';
    if (currentChatbot === 'general') return 'General Documents';
    const chatbot = userChatbots.find(bot => bot.id === currentChatbot);
    return chatbot ? chatbot.name : 'Unknown Chatbot';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIcon = (item) => {
    if (item.type === 'social') {
      const icons = {
        youtube: Youtube,
        linkedin: Linkedin,
        twitter: Twitter,
        github: Github,
        instagram: Instagram,
        facebook: Facebook
      };
      return icons[item.platform] || Link2;
    }
    
    const icons = {
      document: FileText,
      image: Image,
      voice: Mic,
      video: Film
    };
    return icons[item.type] || File;
  };

  const filteredDocuments = documents.filter(doc => {
    if (activeTab !== 'all' && doc.type !== activeTab) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              {(currentChatbot || showAllFiles) && (
                <button
                  onClick={handleBackToFolders}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  {showAllFiles ? (
                    <>
                      <Folder className="w-6 h-6 mr-2" />
                      All Documents
                    </>
                  ) : currentChatbot ? (
                    <>
                      <Bot className="w-6 h-6 mr-2" />
                      {getCurrentChatbotName()} Documents
                    </>
                  ) : (
                    <>
                      <Folder className="w-6 h-6 mr-2" />
                      Chatbot Document Folders
                    </>
                  )}
                </h1>
                <p className="text-white/80 mt-1">
                  {showAllFiles 
                    ? 'View all documents across all chatbots'
                    : currentChatbot 
                    ? 'Manage documents for this chatbot' 
                    : 'Select a chatbot folder to manage its documents'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Storage Info */}
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center">
                <HardDrive className="w-4 h-4 mr-2" />
                Total Storage Used
              </span>
              <span className="text-sm">
                {formatFileSize(storageUsed)} / 500 MB
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${(storageUsed / (500 * 1024 * 1024)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : view === 'folders' ? (
            // Chatbot Folders View
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleViewAllFiles}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center"
                >
                  <Folder className="w-4 h-4 mr-2" />
                  View All Files
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-pink-300 transition text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white font-bold"
                        style={{ backgroundColor: folder.primaryColor || '#6b7280' }}
                      >
                        {folder.avatar}
                      </div>
                      <FolderOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {folder.name}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{folder.fileCount} files</p>
                      <p>{formatFileSize(folder.totalSize)}</p>
                      {folder.lastModified && (
                        <p className="text-xs text-gray-400">
                          Modified {formatDate(folder.lastModified)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            // Files View for specific chatbot
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Search className="text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-400 w-64"
                  />
                </div>
                
                {!showAllFiles && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to {getCurrentChatbotName()}
                  </button>
                )}
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No files in this folder</p>
                    <p className="text-gray-400 mt-2">Upload files to get started</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map(item => {
                    const Icon = getIcon(item);
                    
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg transition relative"
                      >
                        {/* Chatbot Badge for All Files View */}
                        {showAllFiles && (
                          <div className="absolute -top-2 -right-2 z-10">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                              style={{ backgroundColor: item.chatbotColor }}
                              title={item.chatbotName}
                            >
                              {item.chatbotAvatar}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ 
                              backgroundColor: item.type === 'social' ? '#f3f4f6' : '#fce7f3',
                              color: item.type === 'social' ? '#6b7280' : '#ec4899'
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFileToMove(item);
                              setShowMoveDialog(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                            title="Move to another chatbot"
                          >
                            <Move className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <h3 className="font-medium text-gray-800 truncate mb-1">
                          {item.name}
                        </h3>
                        
                        {/* Show chatbot name in All Files view */}
                        {showAllFiles && (
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            <Bot className="w-3 h-3 mr-1" />
                            {item.chatbotName}
                          </p>
                        )}
                        
                        {item.type !== 'social' ? (
                          <>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(item.size)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(item.uploadDate)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 truncate">
                            {item.url}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal 
            onClose={() => setShowUploadModal(false)}
            onUpload={async (files, type, socialData) => {
              try {
                if (type === 'social' && socialData) {
                  for (const [platform, url] of Object.entries(socialData)) {
                    if (url) {
                      await localStorageService.addSocialLink(
                        userId, 
                        platform, 
                        url, 
                        currentChatbot === 'general' ? null : currentChatbot
                      );
                    }
                  }
                  alert('Social links added successfully!');
                } else if (files) {
                  await handleFileUpload(type || 'document', files);
                }
                
                setShowUploadModal(false);
                loadData();
              } catch (error) {
                console.error('Upload error:', error);
                alert('Failed to upload: ' + error.message);
              }
            }}
            chatbotName={getCurrentChatbotName()}
          />
        )}

        {/* Move File Dialog */}
        {showMoveDialog && selectedFileToMove && (
          <MoveFileDialog
            file={selectedFileToMove}
            folders={folders}
            currentFolder={currentChatbot}
            onMove={handleMoveFile}
            onClose={() => {
              setShowMoveDialog(false);
              setSelectedFileToMove(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Move File Dialog Component
const MoveFileDialog = ({ file, folders, currentFolder, onMove, onClose }) => {
  const [selectedFolder, setSelectedFolder] = useState('');

  const handleMove = () => {
    if (selectedFolder && selectedFolder !== currentFolder) {
      onMove(file.id, selectedFolder);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Move File</h2>
          <p className="text-gray-600 mt-1">Select destination folder for "{file.name}"</p>
        </div>

        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {folders.filter(f => f.id !== currentFolder).map(folder => (
            <label
              key={folder.id}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                selectedFolder === folder.id 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="folder"
                value={folder.id}
                checked={selectedFolder === folder.id}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="mr-3"
              />
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                style={{ backgroundColor: folder.primaryColor }}
              >
                {folder.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-800">{folder.name}</p>
                <p className="text-sm text-gray-500">{folder.fileCount} files</p>
              </div>
            </label>
          ))}
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={!selectedFolder}
            className={`px-6 py-2 rounded-lg font-medium text-white transition ${
              selectedFolder
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Move File
          </button>
        </div>
      </div>
    </div>
  );
};

// Upload Modal Component
const UploadModal = ({ onClose, onUpload, chatbotName }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState('file');
  const [fileType, setFileType] = useState('document');
  const [socialLinks, setSocialLinks] = useState({
    youtube: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    github: ''
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      setFileType('image');
    } else if (file.type.startsWith('audio/')) {
      setFileType('voice');
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
    } else {
      setFileType('document');
    }
    
    onUpload(files, fileType);
  };

  const handleSocialSubmit = () => {
    const hasLinks = Object.values(socialLinks).some(link => link.trim() !== '');
    if (!hasLinks) {
      alert('Please enter at least one social media link');
      return;
    }
    
    onUpload(null, 'social', socialLinks);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload to {chatbotName}</h2>
            <p className="text-sm text-gray-600 mt-1">Files will be available for this chatbot</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-2 mb-6">
            {['file', 'social'].map(type => (
              <button
                key={type}
                onClick={() => setUploadType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  uploadType === type
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'file' ? 'Upload Files' : 'Add Social Links'}
              </button>
            ))}
          </div>

          {uploadType === 'file' ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Files will be stored in {chatbotName}'s folder
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition inline-block"
              >
                Choose Files
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Add social media profiles for {chatbotName}</p>
              {[
                { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
                { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
                { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                { name: 'GitHub', icon: Github, color: 'text-gray-800' }
              ].map(({ name, icon: Icon, color }) => (
                <div key={name} className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="w-24 text-sm font-medium text-gray-700">{name}:</span>
                  <input
                    type="url"
                    placeholder={`https://${name.toLowerCase()}.com/...`}
                    value={socialLinks[name.toLowerCase()]}
                    onChange={(e) => setSocialLinks({
                      ...socialLinks, 
                      [name.toLowerCase()]: e.target.value
                    })}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-400"
                  />
                </div>
              ))}
              <button 
                onClick={handleSocialSubmit}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Add Social Links to {chatbotName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;