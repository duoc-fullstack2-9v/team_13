import React, { useState, useEffect } from 'react';
import '../styles/CustomAlert.css';

const CustomAlert = ({ message, type = 'info', onClose, autoClose = true, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`custom-alert custom-alert-${type} ${isAnimating ? 'closing' : ''}`}>
      <div className="custom-alert-content">
        <span className="custom-alert-icon">{getIcon()}</span>
        <span className="custom-alert-message">{message}</span>
        <button className="custom-alert-close" onClick={handleClose}>×</button>
      </div>
    </div>
  );
};

// Hook para manejar alertas de manera global
export const useCustomAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newAlert = {
      id,
      message,
      type,
      duration
    };

    setAlerts(prev => [...prev, newAlert]);

    // Auto-remove after duration
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, duration);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return {
    alerts,
    showAlert,
    removeAlert,
    showSuccess: (message) => showAlert(message, 'success'),
    showError: (message) => showAlert(message, 'error'),
    showWarning: (message) => showAlert(message, 'warning'),
    showInfo: (message) => showAlert(message, 'info')
  };
};

// Componente contenedor para mostrar múltiples alertas
export const AlertContainer = () => {
  const { alerts, removeAlert } = useCustomAlert();

  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <CustomAlert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
          duration={alert.duration}
        />
      ))}
    </div>
  );
};

export default CustomAlert;