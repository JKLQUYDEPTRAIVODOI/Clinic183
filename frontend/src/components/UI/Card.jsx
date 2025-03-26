import React from 'react';
import { Box, Typography } from '@mui/material';
import theme from '../../theme';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  elevation = 1,
  ...props 
}) => {
  return (
    <Box 
      className={`bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}
      sx={{
        boxShadow: theme.shadows[elevation],
        '&:hover': {
          boxShadow: theme.shadows[elevation + 2],
          transform: 'translateY(-2px)',
        },
      }}
      {...props}
    >
      {(title || subtitle) && (
        <Box 
          className={`px-6 py-4 border-b border-gray-100 ${headerClassName}`}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {title && (
            <Typography 
              variant="h6" 
              component="h3"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: subtitle ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      <Box 
        className={`px-6 py-4 ${bodyClassName}`}
        sx={{
          backgroundColor: 'background.paper',
        }}
      >
        {children}
      </Box>
      
      {footer && (
        <Box 
          className={`px-6 py-4 border-t border-gray-100 ${footerClassName}`}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
};

export default Card; 