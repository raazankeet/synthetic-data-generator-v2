"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LoginIcon from '@mui/icons-material/Login';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScannerIcon from '@mui/icons-material/Scanner';

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
  return (
    <AppBar position="static" sx={{ bgcolor: '#2D3748' }}>
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
            onClick={onScanMetadata}
            sx={{
              bgcolor: '#6B46C1',
              '&:hover': { bgcolor: '#553C9A' },
            }}
          >
            SCAN METADATA
          </Button>

          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            onClick={onGenerateRecommendation}
            sx={{
              bgcolor: '#6B46C1',
              '&:hover': { bgcolor: '#553C9A' },
            }}
          >
            GENAI RECOMMENDATION
          </Button>

          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            onClick={onGenerateSyntheticData}
            sx={{
              bgcolor: '#6B46C1',
              '&:hover': { bgcolor: '#553C9A' },
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
          <IconButton color="inherit">
            <DarkModeIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 