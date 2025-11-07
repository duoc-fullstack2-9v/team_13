import React, { useState } from 'react';
import '../styles/DemoNotification.css';

const DemoNotification = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="demo-notification">
      <div className="demo-content">
        <div className="demo-icon">🔥</div>
        <div className="demo-text">
          <strong>Modo Demostración</strong>
          <p>Para usar Google real, configura Firebase siguiendo CONFIGURAR_FIREBASE.md</p>
        </div>
        <button 
          className="demo-close"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default DemoNotification;