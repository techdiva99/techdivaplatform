import React, { useState } from 'react';
import { Star, Coins, Lightbulb, X, Volume2 } from 'lucide-react';

const TreasurePopup = ({ treasure, onCollect, onClose }) => {
  const [showConcept, setShowConcept] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // Text-to-speech function using TechDiva's voice
  const speakConcept = (text) => {
    if (window.speakAsTechDivaWithFeedback) {
      setIsReading(true);
      
      window.speakAsTechDivaWithFeedback(text, {
        rate: 0.8,
        pitch: 1.2,
        volume: 1.0,
        onStart: () => console.log('TechDiva concept explanation started'),
        onEnd: () => {
          setIsReading(false);
          console.log('TechDiva concept explanation completed');
        },
        onError: (error) => {
          setIsReading(false);
          console.warn('TechDiva concept speech failed:', error);
        }
      }).catch((error) => {
        setIsReading(false);
        console.warn('TechDiva concept speech promise failed:', error);
      });
    } else if (window.speakAsTechDiva) {
      // Fallback to regular function
      setIsReading(true);
      
      window.speakAsTechDiva(text, {
        rate: 0.8,
        pitch: 1.2,
        volume: 1.0,
        onEnd: () => setIsReading(false),
        onError: () => setIsReading(false)
      }).catch(() => setIsReading(false));
    }
  };

  const handleCollect = () => {
    setShowConcept(true);
    // Play collection sound
    if (window.playTreasureSound) {
      window.playTreasureSound();
    }
    
    // Updated TechDiva message - simplified and focused on learning
    const textToRead = `Amazing! You discovered ${treasure.concept}! ${treasure.description} You earned ${treasure.coins} coins!`;
    setTimeout(() => speakConcept(textToRead), 500);
    
    setTimeout(() => {
      onCollect(treasure);
    }, 3000); // Show concept for 3 seconds
  };

  if (showConcept) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center relative animate-bounce">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4">
            New Coding Concept Learned!
          </h2>
          <h3 className="text-xl font-semibold text-blue-600 mb-3">
            {treasure.concept}
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {treasure.description}
          </p>
          
          {/* TechDiva Brand Colors - Orange */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <Coins className="w-6 h-6 text-orange-600" />
              <span className="text-xl font-bold text-orange-700">
                +{treasure.coins} coins earned!
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-blue-700">
                Another mystery illuminated! 💡
              </span>
            </div>
          </div>

          {/* Listen button - TechDiva Pink */}
          <button
            onClick={() => speakConcept(`${treasure.concept}. ${treasure.description}`)}
            disabled={isReading}
            className={`
              mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full
              ${isReading 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white'
              }
            `}
          >
            <Volume2 className="w-5 h-5" />
            <span>{isReading ? 'TechDiva is speaking...' : 'Listen to TechDiva'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-6xl mb-4 animate-pulse">⭐</div>
        <h2 className="text-2xl font-bold text-purple-600 mb-4">
          Coding Treasure Found!
        </h2>
        <h3 className="text-xl font-semibold text-blue-600 mb-3">
          {treasure.concept}
        </h3>
        <p className="text-gray-600 mb-6">
          TechDiva has discovered a coding treasure! 
          Click "Collect" to learn about {treasure.concept} and earn coins!
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">Reward: {treasure.coins} coins</span>
          <Coins className="w-5 h-5 text-yellow-500" />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => speakConcept(`Hi! I'm TechDiva! This treasure will teach you about ${treasure.concept}. ${treasure.description} Are you ready to learn something amazing?`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCollect}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            Collect Treasure! ⭐
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreasurePopup;
