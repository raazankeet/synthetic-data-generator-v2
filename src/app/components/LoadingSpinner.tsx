"use client";

import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  overlay?: boolean;
}

const LoadingSpinner = ({ size = 40, overlay = false }: LoadingSpinnerProps) => {
  if (overlay) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
          transition: 'all 0.3s ease'
        }}
      >
        <CircularProgress size={size} sx={{ color: '#6B46C1' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      p: 2,
      transition: 'all 0.3s ease'
    }}>
      <CircularProgress size={size} sx={{ color: '#6B46C1' }} />
    </Box>
  );
};

export default LoadingSpinner; 