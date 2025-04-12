import React from 'react';
import './StyledButton.css';

const StyledButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  icon,
  fullWidth = false,
  disabled = false
}) => {
  return (
    <button
      className={`styled-button ${variant} ${fullWidth ? 'full-width' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default StyledButton; 