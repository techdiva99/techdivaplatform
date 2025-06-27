import React, { useState, useEffect } from 'react';
import { Zap, Share2, Shield, Sparkles, Crown, ChevronLeft, ChevronRight, Play, MessageCircle, ShoppingBag, BookOpen, Library, BookOpenCheck, Gem, DollarSign } from 'lucide-react';
import TechDivaLogo from '../common/TechDivaLogo';
import { testimonials } from '../../constants';

const LandingPage = ({ onGetStarted, onLogin, onGoToStore, onOpenChat }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentChatbotIndex, setCurrentChatbotIndex] = useState(0);

  // Sample chatbots data - you can move this to your constants file
  const featuredChatbots = [
    {
      id: 'recipe-master',
      name: 'Recipe Master',
      description: 'Traditional Indian recipes',
      emoji: '👩‍🍳',
      backgroundColor: '#ff67c7', // Pink
      textColor: '#ffffff', // White text on pink
      category: 'Cooking',
      creator: 'Chef Priya',
      responses: {
        'What can you help me with?': 'I can help you discover authentic Indian recipes, cooking techniques, and ingredient substitutions!',
        'Show me a recipe': 'Here\'s my grandmother\'s famous butter chicken recipe...',
        'default': 'Namaste! I\'m here to share the rich culinary traditions of India. What would you like to cook today?'
      }
    },
    {
      id: 'yoga-guide',
      name: 'Yoga Guide',
      description: 'Daily wellness companion',
      emoji: '🧘‍♀️',
      backgroundColor: '#0aabde', // Blue
      textColor: '#ffffff', // White text on blue
      category: 'Wellness',
      creator: 'Meditation Maya',
      responses: {
        'What can you help me with?': 'I can guide you through yoga poses, meditation techniques, and mindfulness practices.',
        'Show me a pose': 'Let\'s start with Mountain Pose (Tadasana). Stand tall with feet hip-width apart...',
        'default': 'Welcome to your wellness journey! How can I help you find balance today?'
      }
    },
    {
      id: 'career-coach',
      name: 'Career Coach',
      description: 'Professional development',
      emoji: '💼',
      backgroundColor: '#ff9671', // Orange
      textColor: '#ffffff', // White text on orange
      category: 'Career',
      creator: 'Success Sarah',
      responses: {
        'What can you help me with?': 'I can help with resume tips, interview prep, networking strategies, and career planning.',
        'Help with my resume': 'Let\'s make your resume stand out! Start with a strong summary that highlights your unique value...',
        'default': 'Ready to advance your career? I\'m here to help you achieve your professional goals!'
      }
    },
    {
      id: 'code-mentor',
      name: 'Code Mentor',
      description: 'Programming guidance',
      emoji: '👩‍💻',
      backgroundColor: '#ff67c7', // Pink
      textColor: '#ffffff', // White text on pink
      category: 'Technology',
      creator: 'Dev Diana',
      responses: {
        'What can you help me with?': 'I can help you learn programming languages, debug code, and understand software development concepts.',
        'Explain JavaScript': 'JavaScript is a versatile programming language that runs in browsers and servers...',
        'default': 'Hello, future developer! Ready to code your way to success? What programming challenge can I help you with?'
      }
    },
    {
      id: 'travel-buddy',
      name: 'Travel Buddy',
      description: 'Adventure planning assistant',
      emoji: '✈️',
      backgroundColor: '#0aabde', // Blue
      textColor: '#ffffff', // White text on blue
      category: 'Travel',
      creator: 'Wanderer Wendy',
      responses: {
        'What can you help me with?': 'I can help you plan trips, find hidden gems, budget for travel, and share cultural insights.',
        'Plan a trip to Japan': 'Japan is amazing! For first-timers, I recommend Tokyo, Kyoto, and Osaka. Here\'s a 7-day itinerary...',
        'default': 'Ready for your next adventure? I\'m here to help you explore the world! Where shall we go?'
      }
    },
    {
      id: 'study-buddy',
      name: 'Study Buddy',
      description: 'Learning companion',
      emoji: '📚',
      backgroundColor: '#ff9671', // Orange
      textColor: '#ffffff', // White text on orange
      category: 'Education',
      creator: 'Scholar Sam',
      responses: {
        'What can you help me with?': 'I can help you create study schedules, explain complex topics, and provide memory techniques.',
        'Help me study math': 'Math can be fun! Let\'s break down complex problems into simple steps. What topic are you working on?',
        'default': 'Ready to ace your studies? I\'m here to make learning engaging and effective!'
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCurrentChatbotIndex((prev) => (prev + 1) % featuredChatbots.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(carouselTimer);
  }, [featuredChatbots.length]);

  const nextChatbot = () => {
    setCurrentChatbotIndex((prev) => (prev + 1) % featuredChatbots.length);
  };

  const prevChatbot = () => {
    setCurrentChatbotIndex((prev) => (prev - 1 + featuredChatbots.length) % featuredChatbots.length);
  };

  const handleChatbotClick = (chatbot) => {
    // Convert to format expected by ChatInterface
    const chatbotForInterface = {
      id: chatbot.id,
      name: chatbot.name,
      description: chatbot.description,
      avatar: chatbot.emoji,
      primaryColor: chatbot.backgroundColor,
      category: chatbot.category,
      userId: 'demo-user',
      isPublic: true,
      responses: chatbot.responses
    };
    onOpenChat(chatbotForInterface);
  };

  const getVisibleChatbots = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentChatbotIndex + i + featuredChatbots.length) % featuredChatbots.length;
      visible.push({ ...featuredChatbots[index], position: i });
    }
    return visible;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ff67c7' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#ff67c7' }}>
        
        <nav className="relative z-10 px-6 border-b-4" style={{ borderColor: '#ff67c7', backgroundColor: '#ffffff', paddingTop: '16px', paddingBottom: '16px' }}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6" style={{ color: '#ff67c7' }} />
              <div className="text-2xl font-bold" style={{ color: '#ff67c7' }}>
                TechDIVA<sup className="text-xs">TM</sup>
              </div>
              <span className="text-xl font-bold" style={{ color: '#ff67c7' }}>Home</span>
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold ml-2">
                BETA
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff67c7' }}>
                <div className="relative">
                  <BookOpen className="w-5 h-5" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1" />
                </div>
                <span>TechDIVA<sup className="text-xs">TM</sup> Books</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff9671' }}>
                <Crown className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#0aabde' }}>
                <Play className="w-5 h-5" />
                <span>Watch</span>
              </button>
              <button 
                onClick={onGoToStore}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff67c7' }}
              >
                <Gem className="w-5 h-5" />
                <span>Shop</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#0aabde' }}>
                <DollarSign className="w-5 h-5" />
                <span>Pricing</span>
              </button>
              <button
                onClick={onLogin}
                className="px-6 py-2 text-white rounded-full text-xl font-medium hover:shadow-lg transition-all"
                style={{ backgroundColor: '#ff67c7' }}
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 px-6 py-8 text-center">
          {/* Beta Badge - Top Right */}
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse">
            BETA
          </div>
          
          {/* Bigger Logo */}
          <div className="flex justify-center mb-6">
            <div 
              className="transform transition-transform duration-300 relative"
              style={{
                fontSize: '200%',
                transform: 'scale(2.2)',
                transformOrigin: 'center',
                lineHeight: '1'
              }}
            >
              <TechDivaLogo size="large" />
              {/* Beta Badge on Logo */}
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                β
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span style={{ color: '#ffffff' }}>
              Create Your Personal AI Companion
            </span>
          </h2>
          
          {/* Success Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1K+</div>
              <div className="text-sm text-white opacity-90">Chatbots Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">$8K+</div>
              <div className="text-sm text-white opacity-90">Earned by Creators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">300+</div>
              <div className="text-sm text-white opacity-90">Active Users</div>
            </div>
          </div>
          
          <p className="text-base text-white mb-4 max-w-2xl mx-auto">
            <span className="font-semibold">Join our growing community</span> of creators building custom chatbots that reflect their personality, knowledge, and experiences.<br/>
            <span className="font-semibold text-yellow-200">Start earning from day one</span> by sharing them with the world!
          </p>
          
          {/* Beta Notice */}
          <div className="bg-orange-500 bg-opacity-90 rounded-lg px-4 py-2 inline-block mb-4 backdrop-blur-sm">
            <span className="text-white text-sm font-semibold">🚀 Currently in Beta - Join our early testing community!</span>
          </div>
          
          {/* Earning Highlight */}
          <div className="bg-white bg-opacity-20 rounded-full px-6 py-2 inline-block mb-4 backdrop-blur-sm">
            <span className="text-white font-semibold">💰 Top creators earn $100+ monthly</span>
          </div>
          
          <br/>
          
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-white rounded-full text-xl font-semibold transform hover:scale-105 transition-all shadow-lg"
            style={{ backgroundColor: '#0aabde' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ff9671'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0aabde'}
          >
            Start Creating Free
          </button>
        </div>

        {/* Interactive Chatbot Carousel */}
        <div className="relative z-10 pb-12 -mt-2">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Try Our Featured Chatbots</h3>
            <p className="text-lg text-white opacity-90">Click any chatbot to start a conversation!</p>
          </div>
          
          <div className="relative flex justify-center items-center">
            {/* Previous Button */}
            <button
              onClick={prevChatbot}
              className="absolute left-4 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              style={{ color: '#ff67c7' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Chatbot Cards */}
            <div className="flex justify-center space-x-4 px-20">
              {getVisibleChatbots().map((chatbot, index) => (
                <div
                  key={chatbot.id}
                  onClick={() => handleChatbotClick(chatbot)}
                  className={`rounded-2xl shadow-xl p-4 transition-all duration-500 cursor-pointer border-4 transform ${
                    chatbot.position === 0 
                      ? 'scale-110 z-10 hover:scale-115' 
                      : 'scale-90 opacity-70 hover:opacity-90 hover:scale-95'
                  }`}
                  style={{ 
                    backgroundColor: chatbot.backgroundColor, 
                    borderColor: '#ffffff',
                    color: chatbot.textColor,
                    minWidth: '240px'
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">{chatbot.emoji}</div>
                    <h4 className="text-xl font-bold mb-2" style={{ color: chatbot.textColor }}>{chatbot.name}</h4>
                    <p className="text-base opacity-90 mb-2" style={{ color: chatbot.textColor }}>{chatbot.description}</p>
                    <div className="text-xs opacity-75 mb-3" style={{ color: chatbot.textColor }}>
                      by {chatbot.creator} • {chatbot.category}
                    </div>
                    <button className="px-4 py-2 bg-white rounded-full text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105"
                            style={{ color: chatbot.backgroundColor }}>
                      Chat Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextChatbot}
              className="absolute right-4 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              style={{ color: '#ff67c7' }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {featuredChatbots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentChatbotIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentChatbotIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12" style={{ color: '#ff67c7' }}>Why TechDIVA<sup className="text-lg">TM</sup>?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff67c7' }}>
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-2" style={{ color: '#ff67c7' }}>Easy to Create</h4>
              <p className="text-lg text-gray-700">No coding required! Build your chatbot with our intuitive interface in minutes.</p>
            </div>
            <div className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#0aabde' }}>
                <Share2 className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-2" style={{ color: '#0aabde' }}>Share Instantly</h4>
              <p className="text-lg text-gray-700">Share your chatbot with a simple link or embed it in your app.</p>
            </div>
            <div className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff9671' }}>
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-2" style={{ color: '#ff9671' }}>Privacy First</h4>
              <p className="text-lg text-gray-700">Control who can access your chatbot with privacy settings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-6" style={{ backgroundColor: '#ff67c7' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-12 text-white">What Our TechDIVA<sup className="text-lg">TM</sup> Users Say</h3>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4" style={{ color: '#ff67c7' }}>"</div>
            <p className="text-xl text-gray-700 mb-6 italic">
              {testimonials[currentTestimonial].text}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#ff9671' }}>
                {testimonials[currentTestimonial].author.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg" style={{ color: '#ff67c7' }}>{testimonials[currentTestimonial].author}</p>
                <p className="text-base" style={{ color: '#0aabde' }}>{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <div 
                key={index} 
                className="w-3 h-3 rounded-full transition-all"
                style={{ 
                  backgroundColor: index === currentTestimonial ? '#ffffff' : '#ffecf8',
                  border: `2px solid #ffffff`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Media Coverage Section */}
      <div className="py-20 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-4" style={{ color: '#ff67c7' }}>Featured In</h3>
          <p className="text-lg text-center text-gray-600 mb-12">What industry leaders are saying about TechDIVA™</p>
          
          {/* Media Logos */}
          <div className="flex justify-center items-center space-x-12 mb-16 flex-wrap">
            <div className="text-2xl font-bold opacity-60" style={{ color: '#0aabde' }}>TechCrunch</div>
            <div className="text-2xl font-bold opacity-60" style={{ color: '#ff67c7' }}>Forbes</div>
            <div className="text-2xl font-bold opacity-60" style={{ color: '#ff9671' }}>Wired</div>
            <div className="text-2xl font-bold opacity-60" style={{ color: '#0aabde' }}>VentureBeat</div>
            <div className="text-2xl font-bold opacity-60" style={{ color: '#ff67c7' }}>AI News</div>
          </div>

          {/* Media Quotes */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#ff67c7' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "TechDIVA™ brings Uber-like services to AI chatbots, democratizing knowledge sharing like never before. 
                This platform is revolutionizing how we access and share expertise."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0aabde' }}>
                  T
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#0aabde' }}>TechCrunch</p>
                  <p className="text-sm text-gray-500">Technology Review</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#ff9671' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "Legacy knowledge, family wisdom, professional expertise—all in one platform. 
                TechDIVA™ is creating a true masterpiece of organized collective knowledge for all."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#ff9671' }}>
                  F
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#ff9671' }}>Forbes</p>
                  <p className="text-sm text-gray-500">Innovation Report</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#0aabde' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "Social media created connections, but TechDIVA™ is creating structured, accessible knowledge. 
                This is the future of human-AI collaboration."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#ff67c7' }}>
                  W
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#ff67c7' }}>Wired</p>
                  <p className="text-sm text-gray-500">AI & Society</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#ff67c7' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "From grandmother's recipes to cutting-edge tech insights—TechDIVA™ bridges generations 
                and democratizes knowledge like nothing we've seen before."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0aabde' }}>
                  V
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#0aabde' }}>VentureBeat</p>
                  <p className="text-sm text-gray-500">Startup Spotlight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 text-white text-center relative overflow-hidden" style={{ backgroundColor: '#0aabde' }}>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: '#ff67c7' }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: '#ff9671' }} />
        
        <div className="relative z-10">
          <h3 className="text-4xl font-bold mb-6">Ready to Create Your AI Companion?</h3>
          <p className="text-2xl mb-8">Join thousands of users building personalized chatbots</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-white rounded-full text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
              style={{ color: '#ff67c7' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ffecf8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              Get Started Now
            </button>
            <button
              className="px-10 py-5 bg-transparent border-2 border-white rounded-full text-xl font-semibold hover:bg-white transition-all"
              style={{ color: 'white' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.color = '#0aabde'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-6 text-center" style={{ backgroundColor: '#ffffff' }}>
        <p className="text-sm" style={{ color: '#ff67c7' }}>
          © 2025 TechDIVA™. All rights reserved.
        </p>
        <p className="text-sm mt-2" style={{ color: '#ff67c7' }}>
          TechDIVA™ is a trademark of TechDIVA Inc. All product names, logos, and brands are property of their respective owners.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;