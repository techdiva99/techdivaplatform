import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Crown, ChevronLeft, ChevronRight, ShoppingBag, BookOpen, Gem, GraduationCap, Users, Code, Lightbulb } from 'lucide-react';
import TechDivaLogo from '../common/TechDivaLogo';
import { testimonials } from '../../constants';

const LandingPage = ({ onGetStarted, onLogin, onGoToStore, onOpenChat, onPlayGames }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized TechDIVA products data for better performance
  const featuredProducts = useMemo(() => [
    {
      id: 'princess-coding-crown',
      name: "Princess TechDIVA's Coding Crown",
      description: 'Royal AI mentor for young coders',
      emoji: '👑',
      backgroundColor: '#ff67c7',
      textColor: '#ffffff',
      category: 'AI Learning',
      creator: 'Princess TechDIVA',
      type: 'chatbot',
      seoKeywords: ['AI education', 'learn coding', 'princess coding'],
      responses: {
        'What can you help me with?': 'Welcome to my royal coding kingdom! I help young princesses and princes learn the magic of AI and coding!',
        'Teach me coding': 'Let\'s start with your first magical coding spell! In my kingdom, we make computers do amazing things...',
        'default': 'Greetings, future royal coder! Ready to learn the magic of AI with Princess TechDIVA? Let\'s build something enchanting!'
      }
    },
    {
      id: 'princess-magical-adventure-book',
      name: "Princess TechDIVA's Magical AI Adventure",
      description: 'Enchanting stories about AI and technology',
      emoji: '📖',
      backgroundColor: '#ff9671',
      textColor: '#ffffff',
      category: 'Book',
      creator: 'TechDIVA Stories',
      type: 'book',
      seoKeywords: ['AI stories', 'children books', 'princess adventures'],
      ageRange: 'Ages 4-8',
      responses: {
        'Tell me about this book': 'Join Princess TechDIVA on magical adventures where she uses AI to help her kingdom! Perfect for young dreamers.',
        'Read me a story': 'Once upon a time, Princess TechDIVA discovered a magical crown that could talk to computers...',
        'default': 'Discover the magical world where Princess TechDIVA uses AI magic to solve problems and help her friends!'
      }
    },
    {
      id: 'enchanted-robot-kingdom',
      name: "TechDIVA's Enchanted Robot Kingdom",
      description: 'Magical YouTube series about AI and robots',
      emoji: '🎬',
      backgroundColor: '#0aabde',
      textColor: '#ffffff',
      category: 'YouTube Video',
      creator: 'TechDIVA Animation',
      type: 'video',
      duration: '8-12 min episodes',
      seoKeywords: ['AI videos', 'educational animation', 'robot stories'],
      responses: {
        'What\'s this about?': 'Watch TechDIVA\'s magical adventures in the Enchanted Robot Kingdom where AI and friendship save the day!',
        'Show me episodes': 'Our latest episode: "The Royal Robot Ball" - where TechDIVA teaches robots to dance using AI!',
        'default': 'Welcome to the Enchanted Robot Kingdom! Ready for magical AI adventures with TechDIVA?'
      }
    },
    {
      id: 'magic-coding-wand-kit',
      name: "TechDIVA's Magic Coding Wand Kit",
      description: 'Hands-on AI learning kit for young innovators',
      emoji: '🪄',
      backgroundColor: '#ff67c7',
      textColor: '#ffffff',
      category: 'Learning Kit',
      creator: 'TechDIVA Academy',
      type: 'kit',
      ageRange: 'Ages 6-12',
      seoKeywords: ['coding kit', 'hands-on learning', 'AI education'],
      responses: {
        'What\'s in the kit?': 'Your magical coding wand, spell cards, robot friends, and step-by-step adventure guides to create AI magic!',
        'How does it work?': 'Wave your coding wand, cast programming spells, and watch as your robot friends come to life with AI!',
        'default': 'Ready to become a coding wizard? This magical kit teaches real AI skills through enchanted adventures!'
      }
    },
    {
      id: 'royal-crown-cape-set',
      name: "Royal TechDIVA Crown & Cape Set",
      description: 'Inspire daily with royal coding confidence',
      emoji: '👗',
      backgroundColor: '#ff9671',
      textColor: '#ffffff',
      category: 'Merchandise',
      creator: 'TechDIVA Royal Collection',
      type: 'merchandise',
      sizes: 'Kids & Adult sizes',
      seoKeywords: ['coding merchandise', 'princess costume', 'tech inspiration'],
      responses: {
        'Tell me about this set': 'Wear your coding crown with pride! This royal set includes a light-up crown and cape to inspire daily AI adventures.',
        'What makes it special?': 'The crown lights up when you code, and the cape has pockets for all your tech gadgets and magical tools!',
        'default': 'Every future AI leader needs their royal coding attire! Feel confident and inspired in your TechDIVA crown and cape.'
      }
    },
    {
      id: 'royal-ai-academy',
      name: "TechDIVA's Royal AI Academy",
      description: 'Advanced AI mentorship and career guidance',
      emoji: '🏰',
      backgroundColor: '#0aabde',
      textColor: '#ffffff',
      category: 'AI Mentorship',
      creator: 'TechDIVA Academy',
      type: 'chatbot',
      seoKeywords: ['AI career', 'advanced coding', 'tech mentorship'],
      responses: {
        'What can you help me with?': 'Welcome to the Royal AI Academy! I provide advanced AI education and career guidance for aspiring tech leaders.',
        'Teach me advanced AI': 'Let\'s explore machine learning algorithms and how to build intelligent systems that solve real-world problems...',
        'default': 'Ready to advance your AI skills? The Royal Academy offers cutting-edge education for future tech innovators!'
      }
    }
  ], []);

  // Memoized visible items calculation
  const visibleItems = useMemo(() => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentProductIndex + i + featuredProducts.length) % featuredProducts.length;
      visible.push({ ...featuredProducts[index], position: i });
    }
    return visible;
  }, [currentProductIndex, featuredProducts]);

  // Memoized carousel navigation functions
  const nextProduct = useCallback(() => {
    setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
  }, [featuredProducts.length]);

  const prevProduct = useCallback(() => {
    setCurrentProductIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  }, [featuredProducts.length]);

  // Touch gesture handlers for mobile
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextProduct();
      } else {
        prevProduct();
      }
      setTouchStart(null);
    }
  }, [touchStart, nextProduct, prevProduct]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  // Enhanced product click handler with loading state and product type handling
  const handleProductClick = useCallback(async (item) => {
    setIsLoading(true);
    try {
      // Handle different product types
      if (item.type === 'book') {
        // For books, could open a reading interface or book details
        console.log('Opening book:', item.name);
        // You can add book-specific logic here
      } else if (item.type === 'video') {
        // For videos, could open YouTube or video player
        console.log('Opening video:', item.name);
        // You can add video-specific logic here
      } else if (item.type === 'kit') {
        // For kits, could open product page or kit details
        console.log('Opening kit:', item.name);
        // You can add kit-specific logic here
      } else if (item.type === 'merchandise') {
        // For merchandise, could open shop or product details
        console.log('Opening merchandise:', item.name);
        // You can add merchandise-specific logic here
      } else {
        // For chatbots, use the existing chat interface
        const chatbotForInterface = {
          id: item.id,
          name: item.name,
          description: item.description,
          avatar: item.emoji,
          primaryColor: item.backgroundColor,
          category: item.category,
          userId: 'demo-user',
          isPublic: true,
          responses: item.responses
        };
        
        // Simulate brief loading for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        onOpenChat(chatbotForInterface);
      }
    } catch (error) {
      console.error('Error opening item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onOpenChat]);

  // Testimonial auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(carouselTimer);
  }, [featuredProducts.length]);

  // SEO Meta tags effect
  useEffect(() => {
    // Update document title for better SEO
    document.title = "TechDIVA™ - AI Education Platform | Learn Coding & Build Chatbots";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Empower women and girls in AI education and coding. Create custom chatbots, learn artificial intelligence, and join our inspiring community of future female tech CEOs and entrepreneurs.'
      );
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "TechDIVA",
      "description": "AI education platform empowering women and girls in coding and artificial intelligence",
      "url": window.location.origin,
      "logo": `${window.location.origin}/icons/icon-512x512.png`,
      "educationalCredentialAwarded": "AI and Programming Skills",
      "audience": {
        "@type": "EducationalAudience",
        "audienceType": "Women and Girls in Tech"
      },
      "teaches": [
        "Artificial Intelligence",
        "Machine Learning",
        "Programming",
        "Data Science",
        "Robotics",
        "AI Ethics"
      ]
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ff67c7' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#ff67c7' }}>
        
        <nav className="relative z-10 px-4 border-b-4" style={{ borderColor: '#ff67c7', backgroundColor: '#ffffff', paddingTop: '12px', paddingBottom: '12px' }}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#ff67c7' }} />
              <div className="text-lg md:text-2xl font-bold" style={{ color: '#ff67c7' }}>
                TechDIVA<sup className="text-xs">TM</sup>
              </div>
            </div>
            
            {/* Desktop Menu with SEO-friendly labels */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff67c7' }}>
                <div className="relative">
                  <BookOpen className="w-5 h-5" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1" />
                </div>
                <span>AI Education</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff9671' }}>
                <ShoppingBag className="w-5 h-5" />
                <span>Store</span>
              </button>
              {/* Updated: Make Coding button functional to open games */}
              <button 
                onClick={onPlayGames} // Now correctly opens Games Gallery
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" 
                style={{ color: '#0aabde' }}
              >
                <Code className="w-5 h-5" />
                <span>Coding</span>
              </button>
              <button 
                onClick={onGoToStore}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff67c7' }}
              >
                <Gem className="w-5 h-5" />
                <span>Chatbots</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#0aabde' }}>
                <Users className="w-5 h-5" />
                <span>Community</span>
              </button>
              <button
                onClick={onLogin}
                className="px-6 py-2 text-white rounded-full text-xl font-medium hover:shadow-lg transition-all"
                style={{ backgroundColor: '#ff67c7' }}
              >
                Sign In
              </button>
            </div>

            {/* Mobile Menu with accessibility */}
            <div className="flex lg:hidden items-center space-x-1">
              <button 
                className="p-2 rounded-full hover:bg-pink-100 transition-colors touch-target" 
                style={{ color: '#ff67c7' }}
                aria-label="AI Education Resources"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-pink-100 transition-colors touch-target" 
                style={{ color: '#ff9671' }}
                aria-label="Store"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
              {/* Updated: Make mobile Coding button functional */}
              <button 
                onClick={onPlayGames}
                className="p-2 rounded-full hover:bg-pink-100 transition-colors touch-target" 
                style={{ color: '#0aabde' }}
                aria-label="Coding Games"
              >
                <Code className="w-4 h-4" />
              </button>
              <button 
                onClick={onGoToStore}
                className="p-2 rounded-full hover:bg-pink-100 transition-colors touch-target" 
                style={{ color: '#ff67c7' }}
                aria-label="AI Chatbots Store"
              >
                <Gem className="w-4 h-4" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-pink-100 transition-colors touch-target" 
                style={{ color: '#0aabde' }}
                aria-label="Women in Tech Community"
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={onLogin}
                className="px-3 py-2 text-white rounded-full text-xs font-medium hover:shadow-lg transition-all ml-1 touch-target"
                style={{ backgroundColor: '#ff67c7' }}
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 px-6 py-8 text-center">
          
          {/* SEO-optimized logo section */}
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
            </div>
          </div>
          
          {/* SEO-optimized main heading */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span style={{ color: '#ffffff' }}>
              The Only AI Companion Your Family Needs
            </span>
          </h1>
          
          {/* SEO-focused subheading */}
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">
            Stories that nurture childhood curiosity, and tools that educate tomorrow's innovators
          </h2>
          
          {/* Success Stats with SEO context */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-white opacity-90">New Creators This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white opacity-90">AI Learning Community</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">90%</div>
              <div className="text-sm text-white opacity-90">Build Their First Bot in 3 Days</div>
            </div>
          </div>
          
          {/* SEO-rich description */}
          <p className="text-base text-white mb-4 max-w-3xl mx-auto">
            <span className="font-semibold">The AI Future Starts Today - Don't Wait. Join thousands of creators building the AI skills that will define tomorrow's economy.</span> Our community is learning to lead with AI by building future-proof skills today.
          </p>
          
          {/* Value proposition */}
          <div className="bg-white bg-opacity-20 rounded-full px-6 py-2 inline-block mb-6 backdrop-blur-sm">
            <span className="text-white font-semibold">🌟 From curious minds to creative innovators - Start your family's AI adventure today!</span>
          </div>
          
          {/* Main CTA heading */}
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Begin Your AI Adventure
          </h3>
          
          {/* Two clear action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onGetStarted}
              disabled={isLoading}
              className="px-8 py-4 text-white rounded-full text-xl font-semibold transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              style={{ backgroundColor: '#0aabde' }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#ff9671')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#0aabde')}
            >
              <Users className="w-5 h-5" />
              <span>{isLoading ? 'Loading...' : 'Join Community'}</span>
            </button>

            <button
              onClick={onPlayGames}
              className="px-8 py-4 bg-white text-purple-600 rounded-full text-xl font-semibold transform hover:scale-105 transition-all shadow-lg flex items-center space-x-2 hover:bg-purple-50"
              style={{ color: '#ff67c7' }}
            >
              <Code className="w-5 h-5" />
              <span>Play Games</span>
            </button>
          </div>

          {/* Updated subtitle to mention both options */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white opacity-90">
              🎮 <strong>New!</strong> Try our interactive coding games or join our amazing community!
            </p>
          </div>
        </div>

        {/* Enhanced Interactive Product Carousel */}
        <div className="relative z-10 pb-12 -mt-2">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Explore TechDIVA™'s Magical AI Treasures</h3>
            <p className="text-lg text-white opacity-90">Discover magical AI adventures - from stories to chatbots, learning kits to royal merchandise!</p>
          </div>
          
          <div className="relative flex justify-center items-center">
            {/* Previous Button */}
            <button
              onClick={prevProduct}
              aria-label="Previous TechDIVA product"
              className="absolute left-4 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              style={{ color: '#ff67c7' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Product Cards */}
            <div 
              className="flex justify-center space-x-4 px-20"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {visibleItems.map((item, index) => (
                <article
                  key={item.id}
                  onClick={() => !isLoading && handleProductClick(item)}
                  className={`rounded-2xl shadow-xl p-4 transition-all duration-500 cursor-pointer border-4 transform ${
                    item.position === 0 
                      ? 'scale-110 z-10 hover:scale-115' 
                      : 'scale-90 opacity-70 hover:opacity-90 hover:scale-95'
                  } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  style={{ 
                    backgroundColor: item.backgroundColor, 
                    borderColor: '#ffffff',
                    color: item.textColor,
                    minWidth: '260px'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Explore ${item.type}: ${item.name} - ${item.description}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleProductClick(item);
                    }
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-3" role="img" aria-label={item.category}>{item.emoji}</div>
                    <h4 className="text-xl font-bold mb-2" style={{ color: item.textColor }}>{item.name}</h4>
                    <p className="text-base opacity-90 mb-2" style={{ color: item.textColor }}>{item.description}</p>
                    <div className="text-xs opacity-75 mb-3" style={{ color: item.textColor }}>
                      {item.type === 'book' && item.ageRange && `${item.ageRange} • `}
                      {item.type === 'video' && item.duration && `${item.duration} • `}
                      {item.type === 'kit' && item.ageRange && `${item.ageRange} • `}
                      {item.type === 'merchandise' && item.sizes && `${item.sizes} • `}
                      by {item.creator} • {item.category}
                    </div>
                    <button 
                      className="px-4 py-2 bg-white rounded-full text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105"
                      style={{ color: item.backgroundColor }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 
                       item.type === 'book' ? 'Read Story' :
                       item.type === 'video' ? 'Watch Now' :
                       item.type === 'kit' ? 'Explore Kit' :
                       item.type === 'merchandise' ? 'Shop Now' :
                       'Start Learning'}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextProduct}
              aria-label="Next TechDIVA product"
              className="absolute right-4 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              style={{ color: '#ff67c7' }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProductIndex(index)}
                aria-label={`Go to TechDIVA item ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentProductIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Future Opportunities Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#ff67c7' }}>
            Prepare Your Family for the AI Adventure Ahead
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Smart families are getting ready for an AI-powered future. Is yours prepared?
          </p>
          
          {/* Government Support Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🇺🇸</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-semibold">
                  U.S. Government Invests $32 Billion in Early AI Education Initiative
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  "Ensuring American families have access to AI literacy from childhood" - Department of Education, 2024
                </p>
              </div>
            </div>
          </div>
          
          {/* Positive Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-blue-100 rounded-xl p-6 border-l-4" style={{ borderColor: '#0aabde' }}>
              <div className="text-3xl font-bold mb-2" style={{ color: '#0aabde' }}>75%</div>
              <p className="text-sm text-gray-700">of future jobs will require AI skills</p>
              <p className="text-xs text-gray-500 mt-2">- World Economic Forum</p>
            </div>
            <div className="bg-pink-100 rounded-xl p-6 border-l-4" style={{ borderColor: '#ff67c7' }}>
              <div className="text-3xl font-bold mb-2" style={{ color: '#ff67c7' }}>$15T</div>
              <p className="text-sm text-gray-700">in new opportunities AI will create by 2030</p>
              <p className="text-xs text-gray-500 mt-2">- PwC Global AI Study</p>
            </div>
            <div className="bg-orange-100 rounded-xl p-6 border-l-4" style={{ borderColor: '#ff9671' }}>
              <div className="text-3xl font-bold mb-2" style={{ color: '#ff9671' }}>89%</div>
              <p className="text-sm text-gray-700">of children will work in AI-integrated careers</p>
              <p className="text-xs text-gray-500 mt-2">- Harvard Business Review</p>
            </div>
          </div>
          
          {/* Family-Focused Quotes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 text-left shadow-lg border-l-4" style={{ borderColor: '#ff67c7' }}>
              <div className="text-4xl mb-4" style={{ color: '#ff67c7' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "AI is advancing at an unprecedented pace. The families who start preparing their children today 
                will have an enormous advantage in tomorrow's economy. This isn't just about technology - it's about ensuring 
                every child can participate in the future."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#ff67c7' }}>
                  D
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#ff67c7' }}>Dario Amodei</p>
                  <p className="text-sm text-gray-500">CEO, Anthropic</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-left shadow-lg border-l-4" style={{ borderColor: '#0aabde' }}>
              <div className="text-4xl mb-4" style={{ color: '#0aabde' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "The AI transformation is happening faster than any technological shift in human history. 
                We have a unique window to prepare everyone - especially our children - for this new world. 
                Early AI education isn't optional anymore; it's essential."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0aabde' }}>
                  D
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#0aabde' }}>Daniela Amodei</p>
                  <p className="text-sm text-gray-500">President, Anthropic</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Family Call to Action */}
          <div className="rounded-2xl p-8 text-white" style={{ backgroundColor: '#ff9671' }}>
            <h3 className="text-2xl font-bold mb-4">Give Your Family the AI Advantage</h3>
            <p className="text-lg mb-6">
              Join thousands of families already building AI skills together. From curious toddlers to aspiring teens, 
              TechDIVA™ grows with your family's learning journey.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white rounded-full text-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
              style={{ color: '#ff9671' }}
            >
              Start Your Family's AI Adventure
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with SEO keywords */}
      <section className="py-20 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#ff67c7' }}>
            Why Families Choose TechDIVA<sup className="text-lg">TM</sup>?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Magical AI adventures designed for every age, stage, and interest
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <article className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff67c7' }}>
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: '#ff67c7' }}>Magical Kingdom Adventures</h3>
              <p className="text-lg text-gray-700">Choose your role - Princess, Knight, Wizard, or Dragon Trainer - in TechDIVA's magical coding kingdom where every child finds their perfect adventure.</p>
            </article>
            
            <article className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#0aabde' }}>
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: '#0aabde' }}>Like Kumon, But for AI</h3>
              <p className="text-lg text-gray-700">Structured, progressive AI learning that adapts to your child's pace with personalized paths, achievement badges, and parent-child coding sessions.</p>
            </article>
            
            <article className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff9671' }}>
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: '#ff9671' }}>Camps, Parties & Meetups</h3>
              <p className="text-lg text-gray-700">AI summer camps, magical birthday parties, royal coding playdates, and family learning nights that make technology social and fun.</p>
            </article>
            
            <article className="text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#ffecf8' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff67c7' }}>
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: '#ff67c7' }}>Hands-On Magic</h3>
              <p className="text-lg text-gray-700">Physical magic coding wands, interactive story time with characters, build-your-robot workshops, and AI art sessions that bring learning to life.</p>
            </article>
          </div>

          {/* Age-Specific Services Section */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center mb-8" style={{ color: '#ff67c7' }}>
              AI Adventures for Every Age
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Elementary School */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 shadow-lg border-l-4" style={{ borderColor: '#ff67c7' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff67c7' }}>
                    <span className="text-2xl">👑</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2" style={{ color: '#ff67c7' }}>TechDIVA's Magical Kingdom</h4>
                  <p className="text-sm text-gray-600">Ages 3-12 • Elementary School</p>
                </div>
                
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li>• Choose your magical role: Princess, Knight, Wizard, Dragon Trainer</li>
                  <li>• Magical AI stories and interactive games</li>
                  <li>• Royal coding camps and birthday parties</li>
                  <li>• Magic coding wands and enchanted kits</li>
                  <li>• Parent-child kingdom building sessions</li>
                </ul>
                
                <button className="w-full px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105" style={{ backgroundColor: '#ff67c7' }}>
                  Enter the Kingdom
                </button>
              </div>

              {/* Middle School */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg border-l-4 opacity-75" style={{ borderColor: '#0aabde' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#0aabde' }}>
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2" style={{ color: '#0aabde' }}>TechDIVA Academy</h4>
                  <p className="text-sm text-gray-600">Ages 12-15 • Middle School</p>
                  <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                    🔜 Coming 2025
                  </div>
                </div>
                
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li>• AI Movie Magic Studio - Create animated films and special effects</li>
                  <li>• Design Your AI Buddy - Build personalized AI companions</li>
                  <li>• AI coding competitions and tournaments</li>
                  <li>• Teen tech meetups and social coding</li>
                  <li>• Build apps that solve real problems</li>
                </ul>
                
                <button disabled className="w-full px-6 py-3 rounded-full font-semibold text-white transition-all opacity-50 cursor-not-allowed" style={{ backgroundColor: '#0aabde' }}>
                  Join the Waitlist
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">Be the first to experience our teen academy!</p>
              </div>

              {/* High School */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border-l-4 opacity-75" style={{ borderColor: '#ff9671' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff9671' }}>
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2" style={{ color: '#ff9671' }}>TechDIVA Pro</h4>
                  <p className="text-sm text-gray-600">Ages 15-18 • High School</p>
                  <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                    🔜 Coming 2026
                  </div>
                </div>
                
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li>• AI internship program with real companies</li>
                  <li>• Startup incubator for young entrepreneurs</li>
                  <li>• College prep portfolio building</li>
                  <li>• Advanced AI research labs</li>
                  <li>• Monetize and showcase your creations</li>
                </ul>
                
                <button disabled className="w-full px-6 py-3 rounded-full font-semibold text-white transition-all opacity-50 cursor-not-allowed" style={{ backgroundColor: '#ff9671' }}>
                  Join the Waitlist
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">Be the first to launch your AI career!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#ff67c7' }}>
            AI Adventures for Every Age and Stage
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            From curious toddlers to aspiring innovators - your family's complete AI journey
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4" style={{ borderColor: '#ff67c7' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#ff67c7' }}>🧒 Little Explorers (Ages 3-6)</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• ✅ Princess TechDIVA's magical AI stories</li>
                <li>• ✅ AI coloring books and activity sheets</li>
                <li>• ✅ Educational YouTube videos and animations</li>
                <li>• 🔜 Interactive AI friends and games</li>
                <li>• 🔜 Simple voice commands and responses</li>
              </ul>
              <div className="mt-4 text-xs text-gray-600">
                <span className="font-semibold" style={{ color: '#ff67c7' }}>Available now:</span> Stories, coloring books, videos • 
                <span className="font-semibold text-orange-600"> Coming soon:</span> Interactive features
              </div>
              <button className="mt-6 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105" style={{ backgroundColor: '#ff67c7' }}>
                Start Exploring
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4" style={{ borderColor: '#0aabde' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#0aabde' }}>🎨 Creative Builders (Ages 7-12)</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Build your first AI chatbot</li>
                <li>• Code with Princess TechDIVA's magic wand</li>
                <li>• Design AI generated characters</li>
                <li>• Create AI art and music</li>
                <li>• Share creations with friends</li>
              </ul>
              <button className="mt-6 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105" style={{ backgroundColor: '#0aabde' }}>
                Start Building
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 opacity-75" style={{ borderColor: '#ff9671' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#ff9671' }}>🚀 Future Innovators (Ages 13+)</h3>
              <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                🔜 Coming Soon
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Real-world AI project building</li>
                <li>• Advanced chatbot programming</li>
                <li>• AI career exploration</li>
                <li>• Community collaboration projects</li>
                <li>• Showcase and monetize creations</li>
              </ul>
              <button disabled className="mt-6 px-6 py-3 rounded-full font-semibold text-white transition-all opacity-50 cursor-not-allowed" style={{ backgroundColor: '#ff9671' }}>
                Join the Waitlist
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Be the first to innovate with AI!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 px-6" style={{ backgroundColor: '#ff67c7' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Real Stories from TechDIVA™ Families</h2>
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
      </section>

      {/* Enhanced Media Coverage Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#ff67c7' }}>Recognition in AI Education</h2>
          <p className="text-lg text-center text-gray-600 mb-12">Leading publications recognize TechDIVA™ as a game-changer in AI education</p>
          
          {/* Media Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-16 items-center justify-items-center">
            <div className="text-base md:text-2xl font-bold opacity-60 py-2 text-center" style={{ color: '#0aabde' }}>TechCrunch</div>
            <div className="text-base md:text-2xl font-bold opacity-60 py-2 text-center" style={{ color: '#ff67c7' }}>Forbes</div>
            <div className="text-base md:text-2xl font-bold opacity-60 py-2 text-center" style={{ color: '#ff9671' }}>Wired</div>
            <div className="text-base md:text-2xl font-bold opacity-60 py-2 text-center" style={{ color: '#0aabde' }}>IEEE</div>
            <div className="text-base md:text-2xl font-bold opacity-60 py-2 text-center col-span-2 md:col-span-1" style={{ color: '#ff67c7' }}>AI Education</div>
          </div>

          {/* Enhanced Media Quotes with AI Future Focus */}
          <div className="grid md:grid-cols-2 gap-8">
            <article className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#ff67c7' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "TechDIVA™ brings Uber-like services to AI chatbots, democratizing knowledge sharing like never before. 
                This platform is preparing users for an AI-dominated future where such skills will be essential for career survival."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0aabde' }}>
                  T
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#0aabde' }}>TechCrunch</p>
                  <p className="text-sm text-gray-500">Future of Work Report</p>
                </div>
              </div>
            </article>

            <article className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#ff9671' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "Legacy knowledge, family wisdom, professional expertise—all in one platform. 
                TechDIVA™ is creating the AI-native workforce that will dominate the next economy."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#ff9671' }}>
                  F
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#ff9671' }}>Forbes</p>
                  <p className="text-sm text-gray-500">AI Workforce Report</p>
                </div>
              </div>
            </article>

            <article className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#0aabde' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "While millions will be displaced by AI, platforms like TechDIVA™ are creating the tools for humans to thrive alongside artificial intelligence. 
                This is adaptation at its finest."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#ff67c7' }}>
                  W
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#ff67c7' }}>Wired</p>
                  <p className="text-sm text-gray-500">AI & Human Future</p>
                </div>
              </div>
            </article>

            <article className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4" style={{ color: '#ff67c7' }}>"</div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "From grandmother's recipes to cutting-edge tech insights—TechDIVA™ bridges generations 
                while preparing users for an AI-first world where such platforms will be career necessities."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0aabde' }}>
                  V
                </div>
                <div className="ml-3">
                  <p className="font-semibold" style={{ color: '#0aabde' }}>VentureBeat</p>
                  <p className="text-sm text-gray-500">AI Economy Analysis</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-6 text-white text-center relative overflow-hidden" style={{ backgroundColor: '#0aabde' }}>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: '#ff67c7' }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: '#ff9671' }} />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Family's AI Adventure?</h2>
          <p className="text-2xl mb-4">Join thousands of families building magical AI skills together</p>
          <p className="text-lg mb-8 opacity-90">From curious children to confident creators - begin your journey today</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onGetStarted}
              disabled={isLoading}
              className="px-10 py-5 bg-white rounded-full text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#ff67c7' }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#ffecf8')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#ffffff')}
            >
              {isLoading ? 'Loading...' : 'Begin Your AI Adventure'}
            </button>
            <button
              className="px-10 py-5 bg-transparent border-2 border-white rounded-full text-xl font-semibold hover:bg-white transition-all"
              style={{ color: 'white' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.color = '#0aabde'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
            >
              See Family Stories
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Pink Background and White Text */}
      <footer className="py-8 px-6 text-center" style={{ backgroundColor: '#ff67c7' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-base text-white mb-2">
            © 2025 TechDIVA™ - Empowering Everyone in AI Education and Coding
          </p>
          <p className="text-sm text-white opacity-90 mb-4">
            Learn artificial intelligence, master programming, and join the community of innovators shaping technology's future.
          </p>
          
          {/* SEO-friendly footer links */}
          <div className="flex justify-center space-x-6 text-sm text-white opacity-90">
            <span>AI Education</span>
            <span>•</span>
            <span>Coding Tutorials</span>
            <span>•</span>
            <span>Tech Innovation</span>
            <span>•</span>
            <span>Chatbot Builder</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;