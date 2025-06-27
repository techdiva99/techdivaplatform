import React, { useState } from 'react';
import './App.css';

// For now, let's create a simple component to test
const TechDIVAPlatform = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ff67c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🚀 TechDIVA Platform
        </h1>
        <p style={{ fontSize: '1.5rem' }}>
          Your app is working! Now let's add the components.
        </p>
      </div>
    </div>
  );
};

function App() {
  return <TechDIVAPlatform />;
}

export default App;