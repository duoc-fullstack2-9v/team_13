import React from "react";
import "../styles/ResultModal.css";

const ResultModal = ({ type, title, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "🎉";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "success":
        return "btn-success";
      case "error":
        return "btn-error";
      default:
        return "btn-default";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content result-modal">
        <div className={`modal-header ${type}`}>
          <span className="modal-icon">{getIcon()}</span>
          <h2>{title}</h2>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className={getButtonClass()} onClick={onClose}>
            {type === "success" ? "¡Entendido!" : "Reintentar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
