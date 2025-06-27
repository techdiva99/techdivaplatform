import React from 'react';

const TechDivaAvatar = ({ 
  size = 'large', 
  className = '',
  showCrown = true,
  animated = false,
  style = {}
}) => {
  const sizeMap = {
    small: { 
      avatar: 'text-2xl', 
      crown: 'text-lg', 
      crownOffset: '-top-2' 
    },
    medium: { 
      avatar: 'text-4xl', 
      crown: 'text-2xl', 
      crownOffset: '-top-3' 
    },
    large: { 
      avatar: 'text-6xl', 
      crown: 'text-4xl', 
      crownOffset: '-top-6' 
    },
    xlarge: { 
      avatar: 'text-8xl', 
      crown: 'text-6xl', 
      crownOffset: '-top-8' 
    }
  };
  
  const sizes = sizeMap[size] || sizeMap.large;
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      style={style}
    >
      {/* Crown/Tiara */}
      {showCrown && (
        <div className={`
          ${sizes.crown} 
          absolute ${sizes.crownOffset} left-1/2 transform -translate-x-1/2 z-10
          ${animated ? 'animate-pulse' : ''}
        `}>
          👑
        </div>
      )}
      
      {/* TechDiva Avatar */}
      <div className={`
        ${sizes.avatar}
        ${animated ? 'animate-bounce' : ''}
      `}>
        👩‍💻
      </div>
    </div>
  );
};

export default TechDivaAvatar;
