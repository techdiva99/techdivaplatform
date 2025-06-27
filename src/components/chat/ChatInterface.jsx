import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Heart, Share2, MessageCircle, MoreVertical,
  Smile, Paperclip, Mic, Image, ThumbsUp, ThumbsDown,
  RefreshCw, Download, Flag, Copy, Check
} from 'lucide-react';

const ChatInterface = ({ chatbot, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Hi! I'm ${chatbot.name}. ${chatbot.description} What would you like to know?`,
      timestamp: new Date(),
      reactions: { likes: 0, dislikes: 0 }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mock response generator based on chatbot type
  const generateBotResponse = (userMessage) => {
    const responses = {
      'TechDIVA Original': [
        "That's a great question! As a woman in tech, I've learned that continuous learning is key. Let me share my experience...",
        "I understand your concern. When I faced similar challenges, I found that building a strong support network made all the difference.",
        "Absolutely! Here's what worked for me: First, focus on building your confidence through small wins...",
        "Let me share a technique that helped me overcome that challenge..."
      ],
      'Fitness Guru': [
        "Great question about fitness! The key is to start small and be consistent. Here's what I recommend...",
        "Your fitness journey is unique! Based on what you've told me, I suggest starting with...",
        "Nutrition plays a huge role here. Let me share some tips that have worked for many...",
        "That's a common concern! The good news is, with the right approach, you can definitely achieve your goals."
      ]
    };

    // Fallback responses for any chatbot
    const defaultResponses = [
      "That's an interesting point! Let me think about that and share my perspective...",
      "Based on my experience, I'd recommend approaching it this way...",
      "Great question! Here's what I've learned about that topic...",
      "I understand what you're asking. In my view, the best approach would be..."
    ];

    const botResponses = responses[chatbot.name] || defaultResponses;
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  };

  // Handle sending messages
  const handleSend = () => {
    if (inputText.trim()) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputText,
        timestamp: new Date(),
        reactions: { likes: 0, dislikes: 0 }
      };
      
      setMessages([...messages, userMessage]);
      setInputText('');
      setIsTyping(true);

      // Simulate bot response after delay
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: generateBotResponse(inputText),
          timestamp: new Date(),
          reactions: { likes: 0, dislikes: 0 }
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle message reactions
  const handleReaction = (messageId, type) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [type]: msg.reactions[type] + 1
          }
        };
      }
      return msg;
    }));
  };

  // Handle copying message
  const handleCopyMessage = (messageId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Handle quick actions
  const quickActions = [
    { icon: '👋', text: 'Say Hello', message: 'Hello! Nice to meet you!' },
    { icon: '💡', text: 'Get Advice', message: 'Can you give me some advice about...' },
    { icon: '❓', text: 'Ask Question', message: 'I have a question about...' },
    { icon: '🙏', text: 'Thank You', message: 'Thank you for your help!' }
  ];

  const handleQuickAction = (message) => {
    setInputText(message);
    inputRef.current?.focus();
  };

  // Emoji picker (simplified)
  const emojis = ['😊', '😍', '🤔', '👍', '❤️', '🎉', '🙌', '💪', '🌟', '🔥'];

  const handleEmojiSelect = (emoji) => {
    setInputText(inputText + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between" 
             style={{ backgroundColor: chatbot.primaryColor + '10' }}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md relative"
              style={{ backgroundColor: chatbot.primaryColor }}
            >
              {chatbot.avatar}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color: chatbot.primaryColor }}>
                {chatbot.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{chatbot.likes + (liked ? 1 : 0)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{chatbot.responseCount} responses</span>
                </span>
                <span className="text-green-600">● Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <MoreVertical className="w-5 h-5" />
              {showActions && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border py-2 z-10">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Chat</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Clear Chat</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} 
                        ${index === 0 ? 'mt-0' : ''}`}
            >
              <div className={`group max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl relative ${
                    message.type === 'user'
                      ? 'text-white rounded-br-none'
                      : 'bg-white rounded-bl-none shadow-sm'
                  }`}
                  style={{
                    backgroundColor: message.type === 'user' ? chatbot.primaryColor : undefined
                  }}
                  onMouseEnter={() => setSelectedMessage(message.id)}
                  onMouseLeave={() => setSelectedMessage(null)}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-white opacity-70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  
                  {/* Message Actions */}
                  {selectedMessage === message.id && (
                    <div className={`absolute ${
                      message.type === 'user' ? '-left-24' : '-right-24'
                    } top-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button
                        onClick={() => handleCopyMessage(message.id, message.text)}
                        className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleReaction(message.id, 'likes')}
                        className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
                        title="Like"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleReaction(message.id, 'dislikes')}
                        className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
                        title="Dislike"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Reaction counts */}
                {(message.reactions.likes > 0 || message.reactions.dislikes > 0) && (
                  <div className="flex space-x-2 mt-1 ml-2">
                    {message.reactions.likes > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        👍 {message.reactions.likes}
                      </span>
                    )}
                    {message.reactions.dislikes > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        👎 {message.reactions.dislikes}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-t border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.message)}
                  className="px-3 py-1.5 text-sm rounded-full bg-white border hover:bg-gray-50 
                           transition-colors whitespace-nowrap flex items-center space-x-1"
                >
                  <span>{action.icon}</span>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button 
                onClick={() => { setLiked(!liked); }}
                className={`text-sm flex items-center space-x-1 transition-colors ${
                  liked ? 'text-pink-600' : 'hover:text-pink-600'
                }`}
                style={{ color: liked ? '#ff67c7' : undefined }}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              <button 
                className="text-sm flex items-center space-x-1 hover:text-blue-600 transition-colors"
                style={{ color: '#0aabde' }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-end space-x-2">
            {/* Attachment buttons */}
            <div className="flex space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Add image">
                <Image className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Attach file">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add emoji"
              >
                <Smile className="w-5 h-5 text-gray-600" />
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 grid grid-cols-5 gap-1">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            </div>
            
            {/* Input field */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 resize-none"
                style={{ 
                  focusRingColor: chatbot.primaryColor,
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
                rows="1"
              />
            </div>
            
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-3 text-white rounded-full transition-all transform ${
                inputText.trim() 
                  ? 'hover:shadow-lg hover:scale-105' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: chatbot.primaryColor }}
            >
              <Send className="w-5 h-5" />
            </button>
            
            {/* Voice button */}
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                    title="Voice message">
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            This is a demo chat. Create your own chatbot to customize responses!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;