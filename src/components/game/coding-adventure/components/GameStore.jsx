import React, { useState } from 'react';
import { X, Coins, ShoppingCart, Star } from 'lucide-react';

const GameStore = ({ coins, onClose, onPurchase }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);

  const storeItems = [
    {
      id: 1,
      name: 'Rainbow TechDiva',
      description: 'Change TechDiva\'s appearance to rainbow colors!',
      price: 50,
      category: 'avatar',
      emoji: '🌈'
    },
    {
      id: 2,
      name: 'Golden Crown',
      description: 'A shiny golden crown for our coding hero!',
      price: 75,
      category: 'accessory',
      emoji: '👑'
    },
    {
      id: 3,
      name: 'Sparkle Trail',
      description: 'Leave beautiful sparkles wherever TechDiva walks!',
      price: 100,
      category: 'effect',
      emoji: '✨'
    },
    {
      id: 4,
      name: 'Magic Wand',
      description: 'A powerful coding wand to cast programming spells!',
      price: 80,
      category: 'tool',
      emoji: '🪄'
    },
    {
      id: 5,
      name: 'Forest Theme',
      description: 'Change the game background to a magical forest!',
      price: 120,
      category: 'theme',
      emoji: '🌲'
    },
    {
      id: 6,
      name: 'Ocean Theme',
      description: 'Dive into an underwater coding adventure!',
      price: 120,
      category: 'theme',
      emoji: '🌊'
    },
    {
      id: 7,
      name: 'Super Speed Boots',
      description: 'Move twice as fast across the game board!',
      price: 150,
      category: 'powerup',
      emoji: '👢'
    },
    {
      id: 8,
      name: 'Double Coins',
      description: 'Earn double coins from the next 3 treasures!',
      price: 90,
      category: 'powerup',
      emoji: '💰'
    },
    {
      id: 9,
      name: 'Coding Cape',
      description: 'A superhero cape that flows in the digital wind!',
      price: 60,
      category: 'clothing',
      emoji: '🦸‍♀️'
    }
  ];

  const handlePurchase = (item) => {
    if (coins >= item.price && !purchasedItems.includes(item.id)) {
      onPurchase(item, item.price);
      setPurchasedItems(prev => [...prev, item.id]);
      setSelectedItem(null);
    }
  };

  const isPurchased = (itemId) => purchasedItems.includes(itemId);
  const canAfford = (price) => coins >= price;

  const categories = [...new Set(storeItems.map(item => item.category))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center space-x-2">
                <ShoppingCart className="w-8 h-8" />
                <span>TechDiva Store</span>
              </h2>
              <p className="text-purple-100 mt-2">
                Spend your hard-earned coins on amazing items!
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
                <Coins className="w-8 h-8 text-yellow-300" />
                <span>{coins}</span>
              </div>
              <p className="text-sm text-purple-100">Your Coins</p>
            </div>
          </div>
        </div>

        {/* Store Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeItems.map(item => (
              <div
                key={item.id}
                className={`
                  border-2 rounded-lg p-4 transition-all cursor-pointer
                  ${isPurchased(item.id) 
                    ? 'border-green-400 bg-green-50' 
                    : canAfford(item.price)
                    ? 'border-purple-200 bg-white hover:border-purple-400 hover:shadow-lg'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                  }
                `}
                onClick={() => !isPurchased(item.id) && setSelectedItem(item)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 min-h-[40px]">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className={`font-bold ${canAfford(item.price) ? 'text-green-600' : 'text-red-500'}`}>
                      {item.price}
                    </span>
                  </div>

                  {isPurchased(item.id) ? (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                      ✓ Owned
                    </div>
                  ) : canAfford(item.price) ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(item);
                      }}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-semibold w-full"
                    >
                      Buy Now
                    </button>
                  ) : (
                    <div className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold">
                      Not Enough Coins
                    </div>
                  )}

                  <div className="mt-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Confirmation Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
              <div className="text-5xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedItem.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedItem.description}
              </p>
              
              <div className="bg-yellow-100 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-700">
                    Cost: {selectedItem.price} coins
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  You'll have {coins - selectedItem.price} coins left
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchase(selectedItem)}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                >
                  Buy It! 🛒
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="text-center text-sm text-gray-600">
            <p>💡 Earn more coins by collecting coding treasures in the game!</p>
            <p className="mt-1">Items you buy will enhance your gaming experience!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStore;
