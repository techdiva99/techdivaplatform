import React from 'react';
import logoSvg from '../../assets/images/techdiva-logo.svg';

const TechDivaLogo = ({ 
  className = "", 
  size = "large",
  responsive = false,
  style = {} 
}) => {
  const sizeMap = {
    small: { width: 100, height: 100 },
    medium: { width: 150, height: 150 },
    large: { width: 200, height: 200 },
    xlarge: { width: 300, height: 300 }
  };
  
  const dimensions = sizeMap[size] || sizeMap.large;
  
  const imageStyles = responsive 
    ? { 
        maxWidth: '100%', 
        height: 'auto',
        width: `${dimensions.width}px`,
        ...style 
      }
    : { 
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        ...style 
      };
  
  return (
    <img 
      src={logoSvg}
      alt="TechDIVA - AI companion for women in tech"
      className={className}
      style={imageStyles}
    />
  );
};

export default TechDivaLogo;