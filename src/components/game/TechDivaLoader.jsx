import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import TechDivaAvatar from '../common/TechDivaAvatar';

const TechDivaLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('loading'); // 'loading', 'voice', 'transition'
  const [lightIntensity, setLightIntensity] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        setLightIntensity(newProgress / 100);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setStage('voice');
          
          // Play TechDiva's introduction
          if (window.speakAsTechDivaWithFeedback) {
            window.speakAsTechDivaWithFeedback(
              "Hi there! I'm TechDiva! My magical light bulb is ready to illuminate all the coding mysteries waiting for you! Let's light up the world with knowledge!",
              {
                rate: 0.9,
                pitch: 1.3,
                volume: 1.0,
                onEnd: () => {
                  setStage('transition');
                  setTimeout(() => {
                    onComplete();
                  }, 1000);
                }
              }
            );
          } else {
            // Fallback if TTS not available
            setTimeout(() => {
              setStage('transition');
              setTimeout(onComplete, 1000);
            }, 3000);
          }
        }
        
        return Math.min(newProgress, 100);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  const getLightBulbStyle = () => {
    const intensity = lightIntensity;
    return {
      filter: `brightness(${1 + intensity * 2}) drop-shadow(0 0 ${intensity * 20}px #FFD700)`,
      transform: `scale(${1 + intensity * 0.3})`,
      transition: 'all 0.3s ease-out'
    };
  };

  const getSparkleStyle = (delay) => ({
    animation: `sparkle 2s ease-in-out ${delay}s infinite`,
    opacity: lightIntensity
  });

  if (stage === 'transition') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-blue-400 flex items-center justify-center z-50">
        <div className="text-center">
          <TechDivaAvatar size="xlarge" showCrown={true} animated={true} />
          <div className="text-white text-2xl font-bold animate-pulse mt-4">
            ✨ Lighting up the mysteries! ✨
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-4">
        {/* TechDiva Avatar */}
        <div className="relative mb-8">
          <TechDivaAvatar size="large" showCrown={true} />
          <div 
            className="text-4xl absolute -top-2 -right-2"
            style={getLightBulbStyle()}
          >
            💡
          </div>
          
          {/* Sparkles around the light bulb */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-0 left-1/2 text-yellow-300 text-xl"
              style={getSparkleStyle(0)}
            >
              ✨
            </div>
            <div 
              className="absolute top-1/4 right-1/4 text-yellow-300 text-lg"
              style={getSparkleStyle(0.5)}
            >
              ⭐
            </div>
            <div 
              className="absolute bottom-1/4 left-1/4 text-yellow-300 text-lg"
              style={getSparkleStyle(1)}
            >
              ✨
            </div>
          </div>
        </div>

        {/* Title - No more glowing effect */}
        <h1 className="text-3xl font-bold text-white mb-2">
          TechDiva's Coding Adventure
        </h1>
        <p className="text-blue-200 mb-8">
          {stage === 'loading' ? 'Charging up the knowledge light bulb...' : 'TechDiva is speaking...'}
        </p>

        {/* TechDiva Brand Colors Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 via-pink-400 to-blue-400 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-white text-lg font-semibold">
          {progress}% - {
            progress < 25 ? "TechDiva's light bulb is warming up..." :
            progress < 50 ? "Knowledge energy building..." :
            progress < 75 ? "Light bulb getting brighter..." :
            progress < 100 ? "Almost ready to illuminate mysteries!" :
            "Light bulb fully charged! 💡"
          }
        </div>

        {/* Light Bulb Icon with pulsing effect */}
        <div className="mt-6">
          <Lightbulb 
            className="w-16 h-16 mx-auto text-yellow-300"
            style={getLightBulbStyle()}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0.5) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg); 
          }
        }
      `}</style>
    </div>
  );
};

export default TechDivaLoader;
