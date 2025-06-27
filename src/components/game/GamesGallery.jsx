import React, { useState } from 'react';
import { ArrowLeft, Play, Star, Clock, Users, Trophy } from 'lucide-react';
import CodingGame from './coding-adventure/CodingGame';

const GamesGallery = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [guestUser] = useState({
    id: 'guest',
    name: 'Guest Player',
    avatar: '👩‍💻'
  });

  // Games catalog
  const games = [
    {
      id: 'coding-adventure',
      title: "TechDiva's Coding Adventure",
      description: "Help TechDiva collect coding treasures and illuminate the Unlit Mysteries! Learn programming concepts in a fun, kid-friendly way.",
      difficulty: "Beginner",
      duration: "10-15 min",
      ageGroup: "5-12 years",
      concepts: ["Variables", "Loops", "Functions", "Conditionals", "Arrays", "Objects"],
      thumbnail: "🎮",
      rating: 4.9,
      plays: 1234,
      component: CodingGame,
      features: ["Voice narration", "Interactive learning", "Coin system", "Progress tracking"]
    },
    {
      id: 'algorithm-quest',
      title: "Algorithm Quest",
      description: "Navigate through mazes using algorithmic thinking! Learn about sorting, searching, and problem-solving strategies.",
      difficulty: "Intermediate",
      duration: "15-20 min",
      ageGroup: "8-15 years",
      concepts: ["Algorithms", "Sorting", "Searching", "Problem Solving"],
      thumbnail: "🗺️",
      rating: 4.7,
      plays: 856,
      component: null, // Coming soon
      features: ["Step-by-step visualization", "Multiple algorithms", "Time complexity learning"]
    },
    {
      id: 'data-detective',
      title: "Data Detective",
      description: "Solve mysteries using data structures! Organize clues using arrays, stacks, queues, and trees to crack the case.",
      difficulty: "Intermediate",
      duration: "20-25 min",
      ageGroup: "10-16 years",
      concepts: ["Data Structures", "Arrays", "Stacks", "Queues", "Trees"],
      thumbnail: "🔍",
      rating: 4.8,
      plays: 642,
      component: null, // Coming soon
      features: ["Mystery storyline", "Visual data structures", "Detective tools"]
    },
    {
      id: 'web-wizard',
      title: "Web Wizard Workshop",
      description: "Create magical websites with HTML, CSS, and JavaScript! Build your own spellbook of web development skills.",
      difficulty: "Advanced",
      duration: "25-30 min",
      ageGroup: "12+ years",
      concepts: ["HTML", "CSS", "JavaScript", "Web Design"],
      thumbnail: "🪄",
      rating: 4.6,
      plays: 423,
      component: null, // Coming soon
      features: ["Live code editor", "Instant preview", "Magic effects"]
    }
  ];

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game && game.component) {
      const GameComponent = game.component;
      return (
        <GameComponent
          onBack={() => setSelectedGame(null)}
          currentUser={guestUser}
        />
      );
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TechDiva Games Gallery
              </h1>
              <p className="text-gray-600 mt-2">
                Learn coding through fun, interactive games - no login required!
              </p>
            </div>

            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-300"
            >
              {/* Game Thumbnail */}
              <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-6xl">
                {game.thumbnail}
              </div>

              {/* Game Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">
                    {game.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {game.description}
                </p>

                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{game.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{game.ageGroup}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{game.rating}</span>
                  </div>
                </div>

                {/* Concepts */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">You'll Learn:</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.concepts.slice(0, 3).map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {concept}
                      </span>
                    ))}
                    {game.concepts.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{game.concepts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {game.features.slice(0, 2).map((feature) => (
                      <li key={feature} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Play Button */}
                <button
                  onClick={() => {
                    if (game.component) {
                      setSelectedGame(game.id);
                    }
                  }}
                  disabled={!game.component}
                  className={`
                    w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors
                    ${game.component
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {game.component ? (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Play Now</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5" />
                      <span>Coming Soon</span>
                    </>
                  )}
                </button>

                {/* Play Count */}
                <div className="mt-3 text-center text-xs text-gray-500">
                  {game.plays.toLocaleString()} plays
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            More Games Coming Soon! 🚀
          </h2>
          <p className="text-gray-600 mb-6">
            We're working hard to bring you more exciting coding games. 
            Stay tuned for algorithm puzzles, data structure mysteries, and web development adventures!
          </p>
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm">Algorithm Puzzles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm">Data Detective</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🪄</div>
              <div className="text-sm">Web Wizard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesGallery;
