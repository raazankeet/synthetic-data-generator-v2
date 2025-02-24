"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  console.log('ConfirmDialog rendered with open:', open); // Debug log

  const handleConfirm = () => {
    console.log('Confirm button clicked'); // Debug log
    onConfirm();
  };

  const handleCancel = () => {
    console.log('Cancel button clicked'); // Debug log
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
          animation: 'fadeIn 0.3s ease'
        }
      }}
      sx={{
        zIndex: 9999,
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            animation: 'fadeIn 0.3s ease'
          }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={handleCancel}
          sx={{ 
            color: 'text.secondary',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              bgcolor: 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          CANCEL
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          sx={{
            bgcolor: '#6B46C1',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#553C9A',
              transform: 'translateY(-1px)'
            }
          }}
        >
          CONFIRM
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 