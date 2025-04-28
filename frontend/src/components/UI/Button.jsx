import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import theme from '../../theme';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  startIcon,
  endIcon,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'contained':
        return {
          backgroundColor: `${color}.main`,
          color: `${color}.contrastText`,
          '&:hover': {
            backgroundColor: `${color}.dark`,
          },
          '&:disabled': {
            backgroundColor: 'action.disabledBackground',
            color: 'action.disabled',
          },
        };
      case 'outlined':
        return {
          borderColor: `${color}.main`,
          color: `${color}.main`,
          '&:hover': {
            borderColor: `${color}.dark`,
            backgroundColor: `${color}.light`,
          },
          '&:disabled': {
            borderColor: 'action.disabled',
            color: 'action.disabled',
          },
        };
      case 'text':
        return {
          color: `${color}.main`,
          '&:hover': {
            backgroundColor: `${color}.light`,
          },
          '&:disabled': {
            color: 'action.disabled',
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '4px 12px',
          fontSize: '0.875rem',
        };
      case 'large':
        return {
          padding: '8px 24px',
          fontSize: '1rem',
        };
      default:
        return {
          padding: '6px 16px',
          fontSize: '0.875rem',
        };
    }
  };

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition-all duration-200 ${className}`}
      sx={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      }}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 