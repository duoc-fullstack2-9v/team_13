import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe ser usado dentro de un AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newAlert = {
      id,
      message,
      type,
      duration
    };

    setAlerts(prev => [...prev, newAlert]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Métodos de conveniencia
  const showSuccess = (message, duration = 3000) => showAlert(message, 'success', duration);
  const showError = (message, duration = 5000) => showAlert(message, 'error', duration);
  const showWarning = (message, duration = 4000) => showAlert(message, 'warning', duration);
  const showInfo = (message, duration = 4000) => showAlert(message, 'info', duration);

  const value = {
    alerts,
    showAlert,
    removeAlert,
    clearAllAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div className="alert-container">
        {alerts.map(alert => (
          <CustomAlert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() => removeAlert(alert.id)}
            autoClose={alert.duration > 0}
            duration={alert.duration}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertContext;