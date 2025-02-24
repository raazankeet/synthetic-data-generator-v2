"use client";

import { Alert, Snackbar, Box } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  onClose: () => void;
}

const Notification = ({ open, message, type, onClose }: NotificationProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        mt: '64px', // Height of app bar
        mr: 2,      // Right margin
        '& .MuiAlert-root': {
          width: '100%',
          minWidth: '300px',
          maxWidth: '400px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '8px',
        }
      }}
    >
      <Alert 
        onClose={onClose} 
        severity={type}
        variant="filled"
        sx={{ 
          width: '100%',
          '& .MuiAlert-message': {
            fontSize: '0.95rem'
          },
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 