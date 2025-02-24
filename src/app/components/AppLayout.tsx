"use client";

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeProvider, useTheme } from '@/lib/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayoutContent = ({ children }: AppLayoutProps) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      bgcolor: '#f5f5f5',
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        px: 2,
        py: 1.5,
        bgcolor: 'rgb(52, 71, 84)',
        color: 'white',
        gap: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>
        {/* Left side */}
        <Tooltip title="Menu" arrow placement="bottom">
          <IconButton color="inherit" size="small">
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* Center title */}
        <Typography 
          variant="h6" 
          sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          Synthetic Data Generator
        </Typography>

        {/* Right side */}
        <Box sx={{ 
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Tooltip title="Settings" arrow placement="bottom">
            <IconButton color="inherit" size="small">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Help" arrow placement="bottom">
            <IconButton color="inherit" size="small">
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          <Typography 
            sx={{ 
              fontSize: '0.875rem',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            LOGIN
          </Typography>
          
          <Tooltip title="Toggle theme" arrow placement="bottom">
            <IconButton 
              color="inherit" 
              size="small" 
              onClick={toggleTheme}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: 32,
                height: 32
              }}
            >
              <DarkModeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        pt: 3,
      }}>
        {children}
      </Box>
    </Box>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ThemeProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ThemeProvider>
  );
};

export default AppLayout; 