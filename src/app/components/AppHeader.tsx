"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LoginIcon from '@mui/icons-material/Login';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScannerIcon from '@mui/icons-material/Scanner';
import { useTheme } from '@/lib/contexts/ThemeContext';
import ConfirmationDialog from './ConfirmationDialog';
import { useState } from 'react';

interface AppHeaderProps {
  onScanMetadata: () => void;
  onGenerateRecommendation: () => void;
  onGenerateSyntheticData: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onScanMetadata,
  onGenerateRecommendation,
  onGenerateSyntheticData
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleScanMetadata = () => {
    setDialogConfig({
      title: 'Scan Metadata?',
      message: 'Are you sure you want to scan the database to fetch metadata? This action may take a few moments.',
      onConfirm: onScanMetadata,
    });
    setDialogOpen(true);
  };

  const handleGenerateRecommendation = () => {
    setDialogConfig({
      title: 'Generate AI Recommendation?',
      message: 'Are you sure you want to generate AI recommendations for the selected tables? This action may take a few moments.',
      onConfirm: onGenerateRecommendation,
    });
    setDialogOpen(true);
  };

  const handleGenerateSyntheticData = () => {
    setDialogConfig({
      title: 'Generate Synthetic Data?',
      message: 'Are you sure you want to generate synthetic data for the selected tables? This action may take a few moments.',
      onConfirm: onGenerateSyntheticData,
    });
    setDialogOpen(true);
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={isDarkMode ? 0 : 1}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton color="inherit" sx={{ mr: 2 }}>
            <OpenInNewIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Synthetic Data Generator
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ScannerIcon />}
              onClick={handleScanMetadata}
              sx={{
                bgcolor: isDarkMode ? '#553C9A' : '#6B46C1',
                '&:hover': { bgcolor: isDarkMode ? '#44337A' : '#553C9A' },
              }}
            >
              SCAN METADATA
            </Button>

            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              onClick={handleGenerateRecommendation}
              sx={{
                bgcolor: isDarkMode ? '#553C9A' : '#6B46C1',
                '&:hover': { bgcolor: isDarkMode ? '#44337A' : '#553C9A' },
              }}
            >
              GENAI RECOMMENDATION
            </Button>

            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              onClick={handleGenerateSyntheticData}
              sx={{
                bgcolor: isDarkMode ? '#553C9A' : '#6B46C1',
                '&:hover': { bgcolor: isDarkMode ? '#44337A' : '#553C9A' },
              }}
            >
              GENERATE SYNTHETIC DATA
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
            <IconButton color="inherit">
              <LoginIcon />
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{
                '& svg': {
                  transform: isDarkMode ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
            >
              <DarkModeIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={() => {
          dialogConfig.onConfirm();
          setDialogOpen(false);
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
};

export default AppHeader; 