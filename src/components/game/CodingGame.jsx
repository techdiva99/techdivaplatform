import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Coins, Star, Lightbulb, Trophy, Book } from 'lucide-react';
import TreasurePopup from './TreasurePopup';
import GameStore from './GameStore';
import MusicPlayer from './MusicPlayer';
import ConceptSummary from './ConceptSummary';
import TechDivaLoader from './TechDivaLoader';
import TechDivaAvatar from '../common/TechDivaAvatar';

const CodingGame = ({ onBack, currentUser }) => {
  // Game state
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [collectedTreasures, setCollectedTreasures] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showTreasure, setShowTreasure] = useState(null);
  const [showStore, setShowStore] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lightedAreas, setLightedAreas] = useState([]);
  const [learnedConcepts, setLearnedConcepts] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlayingFinalSequence, setIsPlayingFinalSequence] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Game map - 8x6 grid
  const mapWidth = 8;
  const mapHeight = 6;

  // Treasure positions and concepts - wrapped in useMemo to prevent unnecessary re-renders
  const treasures = useMemo(() => [
    { id: 1, x: 3, y: 2, concept: 'Variables', description: 'Variables are like magic boxes that hold special things! You can put numbers, words, or anything inside them and use them later.', coins: 10 },
    { id: 2, x: 6, y: 1, concept: 'Loops', description: 'Loops help us do things over and over again! Like brushing your teeth every morning - you repeat the same steps!', coins: 15 },
    { id: 3, x: 2, y: 4, concept: 'Functions', description: 'Functions are like recipes! You tell the computer step by step how to do something, and it follows your recipe perfectly!', coins: 20 },
    { id: 4, x: 7, y: 3, concept: 'Conditionals', description: 'Conditionals help computers make choices! Like "IF it\'s raining, THEN take an umbrella, ELSE wear sunglasses!"', coins: 25 },
    { id: 5, x: 1, y: 5, concept: 'Arrays', description: 'Arrays are like toy boxes with many compartments! You can store lots of things in order and find them easily!', coins: 30 },
    { id: 6, x: 5, y: 4, concept: 'Objects', description: 'Objects are like describing your favorite toy! They have properties like color, size, and what they can do!', coins: 35 }
  ], []);

  // Updated: Unlit Mystery areas (replacing Ignorance) - wrapped in useMemo for consistency
  const unlitMysteryAreas = useMemo(() => [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
    { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
    { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }
  ], []);

  // Handle keyboard movement - MOVED BEFORE EARLY RETURN
  const handleKeyPress = useCallback((event) => {
    if (showTreasure || showStore) return;

    const { key } = event;
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (key) {
        case 'ArrowUp':
          newY = Math.max(0, prev.y - 1);
          break;
        case 'ArrowDown':
          newY = Math.min(mapHeight - 1, prev.y + 1);
          break;
        case 'ArrowLeft':
          newX = Math.max(0, prev.x - 1);
          break;
        case 'ArrowRight':
          newX = Math.min(mapWidth - 1, prev.x + 1);
          break;
        default:
          return prev;
      }

      return { x: newX, y: newY };
    });
  }, [showTreasure, showStore, mapWidth, mapHeight]);

  // TechDiva introduction when game starts - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    if (!gameStarted) {
      const introTimeout = setTimeout(() => {
        if (window.speakAsTechDivaWithFeedback) {
          window.speakAsTechDivaWithFeedback(
            "Hi there! I'm TechDiva, your coding adventure guide! I'm super excited to help you learn amazing programming concepts while we explore the Unlit Mysteries together! Let's collect some coding treasures and illuminate the world with knowledge!",
            {
              onStart: () => console.log('TechDiva introduction started'),
              onEnd: () => console.log('TechDiva introduction completed')
            }
          );
        } else if (window.speakAsTechDiva) {
          // Fallback to regular function
          window.speakAsTechDiva(
            "Hi there! I'm TechDiva, your coding adventure guide! I'm super excited to help you learn amazing programming concepts while we explore the Unlit Mysteries together! Let's collect some coding treasures and illuminate the world with knowledge!"
          );
        }
        setGameStarted(true);
      }, 1000); // Wait 1 second after component mounts

      return () => clearTimeout(introTimeout);
    }
  }, [gameStarted]);

  // Set up keyboard listeners - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Check for treasure collection - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    const currentTreasure = treasures.find(
      treasure => treasure.x === playerPosition.x && 
                 treasure.y === playerPosition.y && 
                 !collectedTreasures.includes(treasure.id)
    );

    if (currentTreasure) {
      setShowTreasure(currentTreasure);
    }
  }, [playerPosition, collectedTreasures, treasures]);

  // Show loader first
  if (isLoading) {
    return (
      <TechDivaLoader 
        onComplete={() => {
          setIsLoading(false);
          setGameStarted(true);
        }} 
      />
    );
  }

  // Handle treasure collection
  const handleTreasureCollected = async (treasure) => {
    setCollectedTreasures(prev => [...prev, treasure.id]);
    setCoins(prev => prev + treasure.coins);
    setLightedAreas(prev => [...prev, { x: treasure.x, y: treasure.y }]);
    setLearnedConcepts(prev => [...prev, treasure]);
    setShowTreasure(null);

    // Check if game is won (all treasures collected)
    if (collectedTreasures.length + 1 === treasures.length) {
      setIsPlayingFinalSequence(true);
      
      // Wait a moment, then have TechDiva read the final summary
      setTimeout(async () => {
        if (window.speakAsTechDivaWithFeedback) {
          try {
            const finalMessage = `Incredible work, my coding champion! You've collected all the treasures and learned ${treasures.length} amazing programming concepts! You earned ${coins + treasure.coins} coins and illuminated every mystery in the kingdom! You're officially a coding hero!`;
            
            await window.speakAsTechDivaWithFeedback(finalMessage, {
              rate: 0.8,
              pitch: 1.4, // Extra excited for the finale
              volume: 1.0,
              onStart: () => console.log('TechDiva final celebration started'),
              onEnd: () => console.log('TechDiva final celebration completed')
            });
            
            // After TechDiva finishes speaking, show win screen and play music
            setGameWon(true);
            setIsPlayingFinalSequence(false);
            
            // Play victory sound after a short delay
            if (window.playWinSound) {
              setTimeout(() => window.playWinSound(), 500);
            }
          } catch (error) {
            console.warn('TechDiva final speech failed:', error);
            // If speech fails, proceed with normal celebration
            setGameWon(true);
            setIsPlayingFinalSequence(false);
            if (window.playWinSound) {
              setTimeout(() => window.playWinSound(), 500);
            }
          }
        } else if (window.speakAsTechDiva) {
          // Fallback to regular TechDiva function
          try {
            const finalMessage = `Incredible work, my coding champion! You've collected all the treasures and learned ${treasures.length} amazing programming concepts! You earned ${coins + treasure.coins} coins and illuminated every mystery in the kingdom! You're officially a coding hero!`;
            
            await window.speakAsTechDiva(finalMessage, {
              rate: 0.8,
              pitch: 1.4,
              volume: 1.0
            });
            
            setGameWon(true);
            setIsPlayingFinalSequence(false);
            
            if (window.playWinSound) {
              setTimeout(() => window.playWinSound(), 500);
            }
          } catch (error) {
            console.warn('TechDiva fallback speech failed:', error);
            setGameWon(true);
            setIsPlayingFinalSequence(false);
            if (window.playWinSound) {
              setTimeout(() => window.playWinSound(), 500);
            }
          }
        } else {
          // No speech available
          setGameWon(true);
          setIsPlayingFinalSequence(false);
          if (window.playWinSound) {
            setTimeout(() => window.playWinSound(), 500);
          }
        }
      }, 1000);
    }
  };

  // Handle treasure popup close
  const handleTreasureClose = () => {
    setShowTreasure(null);
  };

  // Handle grid cell click for mobile/touch support
  const handleCellClick = (x, y) => {
    if (showTreasure || showStore) return;
    
    // Simple pathfinding - move one step closer to target
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      if (x > prev.x) newX = prev.x + 1;
      else if (x < prev.x) newX = prev.x - 1;
      
      if (y > prev.y) newY = prev.y + 1;
      else if (y < prev.y) newY = prev.y - 1;
      
      return { x: newX, y: newY };
    });
  };

  // Render game grid
  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const isPlayer = playerPosition.x === x && playerPosition.y === y;
        const treasure = treasures.find(t => t.x === x && t.y === y);
        const isCollected = treasure && collectedTreasures.includes(treasure.id);
        const isDark = unlitMysteryAreas.some(area => area.x === x && area.y === y) && 
                     !lightedAreas.some(light => light.x === x && light.y === y);
        const isLighted = lightedAreas.some(light => light.x === x && light.y === y);

        grid.push(
          <div
            key={`${x}-${y}`}
            className={`
              w-16 h-16 border-2 border-blue-200 flex items-center justify-center text-2xl relative cursor-pointer
              ${isDark ? 'bg-gray-800' : isLighted ? 'bg-yellow-100' : 'bg-blue-50'}
              ${isPlayer ? 'ring-4 ring-pink-400' : ''}
              ${!isPlayer ? 'hover:bg-blue-100' : ''}
              transition-all duration-300
            `}
            onClick={() => handleCellClick(x, y)}
            title={`Move to (${x}, ${y})`}
          >
            {/* TechDiva character */}
            {isPlayer && (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center shadow-lg animate-pulse relative">
                <div className="text-xs absolute -top-2 left-1/2 transform -translate-x-1/2">👑</div>
                <span className="text-white font-bold text-sm">👩‍💻</span>
              </div>
            )}

            {/* Treasure */}
            {treasure && !isCollected && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse">
                <Star className="w-3 h-3 text-yellow-600 m-0.5" />
              </div>
            )}

            {/* Light effect for collected treasures */}
            {isLighted && (
              <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded animate-pulse"></div>
            )}

            {/* Unlit Mystery effect */}
            {isDark && (
              <div className="absolute inset-0 bg-gray-900 opacity-70 flex items-center justify-center">
                <span className="text-blue-400 text-xs">�</span>
              </div>
            )}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-blue-500">TechDiva's Coding Adventure</h1>
            <p className="text-gray-600">Help TechDiva collect coding treasures and illuminate mysteries!</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700">{coins}</span>
            </div>
            
            {/* Summary button - only show if concepts have been learned */}
            {learnedConcepts.length > 0 && (
              <button
                onClick={() => setShowSummary(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Book className="w-4 h-4" />
                <span>My Progress</span>
              </button>
            )}
            
            <button
              onClick={() => setShowStore(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              TechDiva Store
            </button>
            
            {/* Voice Debug Button (only in development) */}
            <button
              onClick={() => {
                if (window.testTechDivaVoice) {
                  window.testTechDivaVoice();
                } else {
                  console.log('TechDiva voice system not ready yet');
                }
              }}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              title="Test TechDiva's voice system"
            >
              🎤 Test Voice
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Game Stats */}
          <div className="mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">
                    Treasures: {collectedTreasures.length}/{treasures.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">
                    Mystery Light: {lightedAreas.length} areas
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Use arrow keys or click on the grid to move TechDiva!
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${(collectedTreasures.length / treasures.length) * 100}%` }}
              >
                {collectedTreasures.length > 0 && (
                  <span className="text-white text-xs font-bold">
                    {Math.round((collectedTreasures.length / treasures.length) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Game Grid */}
          <div 
            className="grid gap-1 mx-auto w-fit"
            style={{ gridTemplateColumns: `repeat(${mapWidth}, 1fr)` }}
          >
            {renderGrid()}
          </div>

          {/* Game Instructions */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">How to Play:</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Use arrow keys or click on grid squares to move TechDiva (TD)</li>
              <li>• Collect yellow star treasures to learn coding concepts</li>
              <li>• Each treasure gives you coins and lights up dark mystery areas</li>
              <li>• Defeat Unlit Mysteries by bringing knowledge to all dark areas</li>
              <li>• Use coins in the TechDiva Store to buy cool items!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Treasure Popup */}
      {showTreasure && (
        <TreasurePopup
          treasure={showTreasure}
          onCollect={handleTreasureCollected}
          onClose={handleTreasureClose}
        />
      )}

      {/* Store Modal */}
      {showStore && (
        <GameStore
          coins={coins}
          onClose={() => setShowStore(false)}
          onPurchase={(item, cost) => {
            if (coins >= cost) {
              setCoins(prev => prev - cost);
              // Handle purchase logic here
            }
          }}
        />
      )}

      {/* Final Celebration Sequence */}
      {isPlayingFinalSequence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <TechDivaAvatar size="large" showCrown={true} animated={true} className="mb-4" />
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              TechDiva is celebrating your victory!
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-gray-700 italic">
              "Listen to TechDiva's exciting final message!"
            </p>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2 techdiva-name">
              TechDiva's Victory Celebration!
            </h2>
            <div className="flex items-center justify-center mb-4">
              <span className="text-lg font-semibold text-purple-500 techdiva-text">TechDiva</span>
              <div className="techdiva-voice-indicator">
                <span style={{'--delay': 1}}></span>
                <span style={{'--delay': 2}}></span>
                <span style={{'--delay': 3}}></span>
                <span style={{'--delay': 4}}></span>
                <span style={{'--delay': 5}}></span>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              You and TechDiva have collected all the coding treasures and illuminated every mystery! 
              You've learned amazing programming concepts and earned {coins} coins! TechDiva is so proud of you!
            </p>
            <div className="flex space-x-3 mb-4">
              <button
                onClick={() => setShowSummary(true)}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Book className="w-5 h-5" />
                <span>View Summary</span>
              </button>
              <button
                onClick={() => {
                  setGameWon(false);
                  setCollectedTreasures([]);
                  setLearnedConcepts([]);
                  setLightedAreas([]);
                  setCoins(0);
                  setPlayerPosition({ x: 1, y: 1 });
                  setGameStarted(false); // Allow intro to play again
                }}
                className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Play Again
              </button>
            </div>
            {/* Voice Test Button (for debugging) */}
            <button
              onClick={() => {
                if (window.testTechDivaVoice) {
                  window.testTechDivaVoice();
                }
              }}
              className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              Test TechDiva Voice
            </button>
          </div>
        </div>
      )}

      {/* Concept Summary Modal */}
      {showSummary && (
        <ConceptSummary
          learnedConcepts={learnedConcepts}
          totalCoins={coins}
          onClose={() => setShowSummary(false)}
        />
      )}

      {/* Music Player */}
      <MusicPlayer
        isPlaying={showTreasure !== null}
        isWinning={collectedTreasures.length > 0}
      />
    </div>
  );
};

export default CodingGame;
