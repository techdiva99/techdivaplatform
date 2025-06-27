// services/localStorageService.js
// Enhanced version with chatbot-specific document folders

class LocalStorageService {
  constructor() {
    this.dbName = 'TechDIVAStorage';
    this.db = null;
    this.initDB();
  }

  // Initialize IndexedDB with enhanced schema
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 3); // Increment version
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Files store with chatbot association
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('userId', 'userId', { unique: false });
          fileStore.createIndex('type', 'type', { unique: false });
          fileStore.createIndex('chatbotId', 'chatbotId', { unique: false });
          fileStore.createIndex('userAndBot', ['userId', 'chatbotId'], { unique: false });
        } else {
          // Add chatbot index to existing store
          const transaction = event.target.transaction;
          const fileStore = transaction.objectStore('files');
          if (!fileStore.indexNames.contains('chatbotId')) {
            fileStore.createIndex('chatbotId', 'chatbotId', { unique: false });
            fileStore.createIndex('userAndBot', ['userId', 'chatbotId'], { unique: false });
          }
        }
        
        // Links store
        if (!db.objectStoreNames.contains('links')) {
          const linkStore = db.createObjectStore('links', { keyPath: 'id' });
          linkStore.createIndex('userId', 'userId', { unique: false });
          linkStore.createIndex('chatbotId', 'chatbotId', { unique: false });
        }
        
        // Storage metadata
        if (!db.objectStoreNames.contains('storage')) {
          db.createObjectStore('storage', { keyPath: 'userId' });
        }

        // Chatbot folders metadata
        if (!db.objectStoreNames.contains('chatbotFolders')) {
          const folderStore = db.createObjectStore('chatbotFolders', { keyPath: 'id' });
          folderStore.createIndex('userId', 'userId', { unique: false });
          folderStore.createIndex('chatbotId', 'chatbotId', { unique: false });
        }
      };
    });
  }

  // Wait for DB to be ready
  async ensureDB() {
    if (!this.db) {
      await this.initDB();
    }
  }

  // Create or get chatbot folder
  async ensureChatbotFolder(userId, chatbotId, chatbotName) {
    await this.ensureDB();
    
    const folderId = `folder_${userId}_${chatbotId}`;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chatbotFolders'], 'readwrite');
      const store = transaction.objectStore('chatbotFolders');
      
      // Check if folder exists
      const getRequest = store.get(folderId);
      
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result);
        } else {
          // Create new folder
          const folder = {
            id: folderId,
            userId: userId,
            chatbotId: chatbotId,
            chatbotName: chatbotName || 'Unnamed Chatbot',
            createdAt: new Date().toISOString(),
            fileCount: 0,
            totalSize: 0
          };
          
          store.add(folder);
          resolve(folder);
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Upload file to specific chatbot folder
  async uploadFile(userId, file, category, chatbotId = null) {
    await this.ensureDB();
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const fileDoc = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userId,
          chatbotId: chatbotId, // Associate with specific chatbot
          name: file.name,
          originalName: file.name,
          size: file.size,
          type: category,
          mimeType: file.type,
          data: e.target.result, // Base64 data
          uploadDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          tags: [],
          isPublic: false,
          thumbnail: null
        };

        // Generate thumbnail for images
        if (category === 'image' && file.type.startsWith('image/')) {
          try {
            fileDoc.thumbnail = await this.generateThumbnail(e.target.result);
          } catch (error) {
            console.warn('Failed to generate thumbnail:', error);
          }
        }

        try {
          const transaction = this.db.transaction(['files', 'storage', 'chatbotFolders'], 'readwrite');
          const fileStore = transaction.objectStore('files');
          const storageStore = transaction.objectStore('storage');
          const folderStore = transaction.objectStore('chatbotFolders');
          
          // Add file
          fileStore.add(fileDoc);
          
          // Update user storage
          const storageRequest = storageStore.get(userId);
          storageRequest.onsuccess = () => {
            const storage = storageRequest.result || { 
              userId, 
              totalSize: 0, 
              fileCount: 0 
            };
            storage.totalSize = (storage.totalSize || 0) + file.size;
            storage.fileCount = (storage.fileCount || 0) + 1;
            storage.lastUpdated = new Date().toISOString();
            
            storageStore.put(storage);
          };

          // Update chatbot folder if specified
          if (chatbotId) {
            const folderId = `folder_${userId}_${chatbotId}`;
            const folderRequest = folderStore.get(folderId);
            
            folderRequest.onsuccess = () => {
              const folder = folderRequest.result;
              if (folder) {
                folder.fileCount = (folder.fileCount || 0) + 1;
                folder.totalSize = (folder.totalSize || 0) + file.size;
                folder.lastModified = new Date().toISOString();
                folderStore.put(folder);
              }
            };
          }

          transaction.oncomplete = () => {
            // Don't include data in response for performance
            const { data, ...metadata } = fileDoc;
            resolve(metadata);
          };

          transaction.onerror = () => reject(transaction.error);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // Get files for specific chatbot
  async getChatbotFiles(userId, chatbotId) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const index = store.index('userAndBot');
      const request = index.getAll([userId, chatbotId]);
      
      request.onsuccess = () => {
        const files = request.result.map(file => {
          const { data, ...metadata } = file;
          return metadata;
        });
        resolve(files);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Get all user files (including chatbot associations)
  async getUserFiles(userId, chatbotId = null) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      
      let request;
      if (chatbotId) {
        // Get files for specific chatbot
        const index = store.index('userAndBot');
        request = index.getAll([userId, chatbotId]);
      } else {
        // Get all user files
        const index = store.index('userId');
        request = index.getAll(userId);
      }
      
      request.onsuccess = () => {
        const files = request.result.map(file => {
          const { data, ...metadata } = file;
          return metadata;
        });
        resolve(files);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Get user's chatbot folders
  async getUserChatbotFolders(userId) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chatbotFolders'], 'readonly');
      const store = transaction.objectStore('chatbotFolders');
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Move file to different chatbot
  async moveFileToChatbot(fileId, newChatbotId) {
    await this.ensureDB();
    
    return new Promise(async (resolve, reject) => {
      try {
        const file = await this.getFile(fileId);
        if (!file) {
          reject(new Error('File not found'));
          return;
        }

        const transaction = this.db.transaction(['files', 'chatbotFolders'], 'readwrite');
        const fileStore = transaction.objectStore('files');
        const folderStore = transaction.objectStore('chatbotFolders');
        
        // Update file's chatbot association
        const oldChatbotId = file.chatbotId;
        file.chatbotId = newChatbotId;
        file.lastModified = new Date().toISOString();
        
        fileStore.put(file);
        
        // Update folder statistics
        if (oldChatbotId) {
          const oldFolderId = `folder_${file.userId}_${oldChatbotId}`;
          const oldFolderRequest = folderStore.get(oldFolderId);
          
          oldFolderRequest.onsuccess = () => {
            const oldFolder = oldFolderRequest.result;
            if (oldFolder) {
              oldFolder.fileCount = Math.max(0, (oldFolder.fileCount || 0) - 1);
              oldFolder.totalSize = Math.max(0, (oldFolder.totalSize || 0) - file.size);
              folderStore.put(oldFolder);
            }
          };
        }
        
        if (newChatbotId) {
          const newFolderId = `folder_${file.userId}_${newChatbotId}`;
          const newFolderRequest = folderStore.get(newFolderId);
          
          newFolderRequest.onsuccess = () => {
            const newFolder = newFolderRequest.result;
            if (newFolder) {
              newFolder.fileCount = (newFolder.fileCount || 0) + 1;
              newFolder.totalSize = (newFolder.totalSize || 0) + file.size;
              folderStore.put(newFolder);
            }
          };
        }
        
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Add social link to specific chatbot
  async addSocialLink(userId, platform, url, chatbotId = null) {
    await this.ensureDB();
    
    const linkDoc = {
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      chatbotId: chatbotId, // Associate with specific chatbot
      type: 'social',
      platform: platform,
      name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile`,
      url: url,
      addedDate: new Date().toISOString(),
      lastVerified: new Date().toISOString(),
      isActive: true
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['links'], 'readwrite');
      const store = transaction.objectStore('links');
      const request = store.add(linkDoc);
      
      request.onsuccess = () => resolve(linkDoc);
      request.onerror = () => reject(request.error);
    });
  }

  // Get chatbot-specific social links
  async getChatbotSocialLinks(userId, chatbotId) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['links'], 'readonly');
      const store = transaction.objectStore('links');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const links = request.result.filter(link => 
          link.userId === userId && link.chatbotId === chatbotId
        );
        resolve(links);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Generate thumbnail (existing method)
  async generateThumbnail(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }

  // Get single file with data
  async getFile(fileId) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(fileId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete file (updated to handle folder stats)
  async deleteFile(fileId, userId) {
    await this.ensureDB();
    
    return new Promise(async (resolve, reject) => {
      try {
        const file = await this.getFile(fileId);
        if (!file) {
          reject(new Error('File not found'));
          return;
        }

        const transaction = this.db.transaction(['files', 'storage', 'chatbotFolders'], 'readwrite');
        const fileStore = transaction.objectStore('files');
        const storageStore = transaction.objectStore('storage');
        const folderStore = transaction.objectStore('chatbotFolders');
        
        // Delete file
        fileStore.delete(fileId);
        
        // Update user storage
        const storageRequest = storageStore.get(userId);
        storageRequest.onsuccess = () => {
          const storage = storageRequest.result || { 
            userId, 
            totalSize: 0, 
            fileCount: 0 
          };
          storage.totalSize = Math.max(0, (storage.totalSize || 0) - file.size);
          storage.fileCount = Math.max(0, (storage.fileCount || 0) - 1);
          storage.lastUpdated = new Date().toISOString();
          
          storageStore.put(storage);
        };

        // Update chatbot folder if file was associated
        if (file.chatbotId) {
          const folderId = `folder_${userId}_${file.chatbotId}`;
          const folderRequest = folderStore.get(folderId);
          
          folderRequest.onsuccess = () => {
            const folder = folderRequest.result;
            if (folder) {
              folder.fileCount = Math.max(0, (folder.fileCount || 0) - 1);
              folder.totalSize = Math.max(0, (folder.totalSize || 0) - file.size);
              folder.lastModified = new Date().toISOString();
              folderStore.put(folder);
            }
          };
        }
        
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get user social links (all or by chatbot)
  async getUserSocialLinks(userId, chatbotId = null) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['links'], 'readonly');
      const store = transaction.objectStore('links');
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onsuccess = () => {
        let links = request.result;
        if (chatbotId !== null) {
          links = links.filter(link => link.chatbotId === chatbotId);
        }
        resolve(links);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Delete social link
  async deleteSocialLink(linkId) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['links'], 'readwrite');
      const store = transaction.objectStore('links');
      const request = store.delete(linkId);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Get storage info
  async getUserStorage(userId) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');
      const request = store.get(userId);
      
      request.onsuccess = () => {
        const storage = request.result || { totalSize: 0, fileCount: 0 };
        const limit = 500 * 1024 * 1024; // 500MB limit
        resolve({
          used: storage.totalSize || 0,
          limit: limit,
          fileCount: storage.fileCount || 0,
          percentage: ((storage.totalSize || 0) / limit) * 100
        });
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Download file
  async downloadFile(fileId, fileName) {
    const file = await this.getFile(fileId);
    if (!file || !file.data) {
      throw new Error('File not found');
    }

    const base64Data = file.data.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.mimeType });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Clear all data
  async clearAllData() {
    await this.ensureDB();
    
    const transaction = this.db.transaction(['files', 'links', 'storage', 'chatbotFolders'], 'readwrite');
    
    transaction.objectStore('files').clear();
    transaction.objectStore('links').clear();
    transaction.objectStore('storage').clear();
    transaction.objectStore('chatbotFolders').clear();
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Export chatbot data
  async exportChatbotData(userId, chatbotId, chatbotName) {
    const files = await this.getChatbotFiles(userId, chatbotId);
    const links = await this.getChatbotSocialLinks(userId, chatbotId);
    
    const exportData = {
      chatbotId,
      chatbotName,
      userId,
      exportDate: new Date().toISOString(),
      files: files.length,
      links: links.length,
      fileList: files.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
        uploadDate: f.uploadDate
      })),
      socialLinks: links
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatbotName.replace(/\s+/g, '_')}_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const localStorageService = new LocalStorageService();
export default localStorageService;