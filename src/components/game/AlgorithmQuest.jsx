import React from 'react';
import { ArrowLeft, Code, Lightbulb } from 'lucide-react';

const AlgorithmQuest = ({ onBack, currentUser }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600">Algorithm Quest</h1>
            <p className="text-gray-600">Navigate mazes using algorithmic thinking!</p>
          </div>

          <div className="w-32"></div> {/* Spacer */}
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <div className="text-8xl mb-6">🗺️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
          <p className="text-lg text-gray-600 mb-6">
            We're working hard to bring you an amazing algorithmic adventure! 
            Learn sorting, searching, and problem-solving through interactive mazes and puzzles.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <Code className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Algorithm Visualization</h3>
              <p className="text-sm text-green-600">See how sorting and searching works step-by-step</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <Lightbulb className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Problem Solving</h3>
              <p className="text-sm text-blue-600">Learn to break down complex problems</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Games Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmQuest;
