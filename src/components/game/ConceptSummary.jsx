import React, { useState } from 'react';
import { X, Book, Volume2, Award, Coins } from 'lucide-react';

const ConceptSummary = ({ learnedConcepts, totalCoins, onClose }) => {
  const [readingIndex, setReadingIndex] = useState(-1);

  // Text-to-speech function using TechDiva's voice
  const speakConcept = (concept, index) => {
    if (window.speakAsTechDivaWithFeedback) {
      setReadingIndex(index);
      
      window.speakAsTechDivaWithFeedback(`${concept.concept}. ${concept.description}`, {
        rate: 0.8,
        pitch: 1.2,
        volume: 1.0,
        onStart: () => console.log(`TechDiva explaining concept: ${concept.concept}`),
        onEnd: () => {
          setReadingIndex(-1);
          console.log(`TechDiva finished explaining: ${concept.concept}`);
        },
        onError: (error) => {
          setReadingIndex(-1);
          console.warn('TechDiva individual concept speech failed:', error);
        }
      }).catch((error) => {
        setReadingIndex(-1);
        console.warn('TechDiva individual concept promise failed:', error);
      });
    } else if (window.speakAsTechDiva) {
      // Fallback to regular function
      setReadingIndex(index);
      
      window.speakAsTechDiva(`${concept.concept}. ${concept.description}`, {
        rate: 0.8,
        pitch: 1.2,
        volume: 1.0,
        onEnd: () => setReadingIndex(-1),
        onError: () => setReadingIndex(-1)
      }).catch(() => setReadingIndex(-1));
    }
  };

  const speakAll = () => {
    if (window.speakAsTechDivaWithFeedback) {
      setReadingIndex(-2);
      
      const allText = `Hi there! I'm TechDiva, and I'm so proud of you! You learned ${learnedConcepts.length} amazing coding concepts! Let me tell you about each one. ` +
        learnedConcepts.map(concept => 
          `${concept.concept}: ${concept.description}`
        ).join('. ') + 
        ` You earned ${totalCoins} coins in total! You're becoming an incredible coder, and I'm so excited to see what you'll build next!`;
      
      window.speakAsTechDivaWithFeedback(allText, {
        rate: 0.8,
        pitch: 1.2,
        volume: 1.0,
        onStart: () => console.log('TechDiva full summary started'),
        onEnd: () => {
          setReadingIndex(-1);
          console.log('TechDiva full summary completed');
        },
        onError: (error) => {
          setReadingIndex(-1);
          console.warn('TechDiva full summary speech failed:', error);
        }
      }).catch((error) => {
        setReadingIndex(-1);
        console.warn('TechDiva full summary promise failed:', error);
      });
    } else if (window.speakAsTechDiva) {
      // Fallback to regular function
      setReadingIndex(-2);
      
      const allText = `Hi there! I'm TechDiva, and I'm so proud of you! You learned ${learnedConcepts.length} amazing coding concepts! Let me tell you about each one. ` +
        learnedConcepts.map(concept => 
          `${concept.concept}: ${concept.description}`
        ).join('. ') + 
        ` You earned ${totalCoins} coins in total! You're becoming an incredible coder, and I'm so excited to see what you'll build next!`;
      
      window.speakAsTechDiva(allText, {
        rate: 0.8,
        pitch: 1.2,
        volume: 1.0,
        onEnd: () => setReadingIndex(-1),
        onError: () => setReadingIndex(-1)
      }).catch(() => setReadingIndex(-1));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <Book className="w-8 h-8" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold techdiva-name">Your Coding Journey Summary</h2>
              <p className="text-purple-100 flex items-center">
                <span className="techdiva-text">All the amazing concepts you learned today!</span>
                <div className="techdiva-voice-indicator ml-2">
                  <span style={{'--delay': 1}}></span>
                  <span style={{'--delay': 2}}></span>
                  <span style={{'--delay': 3}}></span>
                  <span style={{'--delay': 4}}></span>
                  <span style={{'--delay': 5}}></span>
                </div>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Achievement Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-100 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">
                {learnedConcepts.length}
              </div>
              <div className="text-sm text-yellow-600">Concepts Learned</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <Coins className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {totalCoins}
              </div>
              <div className="text-sm text-green-600">Coins Earned</div>
            </div>
          </div>

          {/* Listen to All Button */}
          <div className="mb-6 text-center">
            <button
              onClick={speakAll}
              disabled={readingIndex === -2}
              className={`
                px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 mx-auto
                ${readingIndex === -2 
                  ? 'bg-green-500 text-white cursor-not-allowed' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
                }
              `}
            >
              <Volume2 className="w-5 h-5" />
              <span>
                {readingIndex === -2 ? 'TechDiva is reading your summary...' : 'Have TechDiva read your entire learning journey'}
              </span>
            </button>
          </div>

          {/* Concepts List */}
          <div className="space-y-4">
            {learnedConcepts.map((concept, index) => (
              <div
                key={concept.id}
                className={`
                  border-2 rounded-lg p-4 transition-all
                  ${readingIndex === index 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-purple-200 bg-purple-50'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-purple-600 mb-2">
                      {concept.concept}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {concept.description}
                    </p>
                    <div className="mt-3 flex items-center space-x-2 text-sm text-purple-600">
                      <Coins className="w-4 h-4" />
                      <span>Earned {concept.coins} coins</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => speakConcept(concept, index)}
                    disabled={readingIndex === index}
                    className={`
                      ml-4 p-2 rounded-full transition-colors
                      ${readingIndex === index 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }
                    `}
                    title="Listen to this concept"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t text-center">
          <p className="text-gray-600 mb-2">
            🎉 Amazing work learning to code! Keep practicing these concepts!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptSummary;
