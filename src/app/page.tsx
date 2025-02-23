"use client";

import { useState } from 'react';
import { Box, TextField, Container, Typography } from '@mui/material';
import MetadataTable from './components/MetadataTable';
import AppHeader from './components/AppHeader';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export default function Home() {
  const [tableName, setTableName] = useState('member');

  const handleScanMetadata = () => {
    // Implement scan metadata functionality
    console.log('Scanning metadata...');
  };

  const handleGenerateRecommendation = () => {
    // Implement recommendation functionality
    console.log('Generating recommendation...');
  };

  const handleGenerateSyntheticData = () => {
    // Implement synthetic data generation
    console.log('Generating synthetic data...');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppHeader
          onScanMetadata={handleScanMetadata}
          onGenerateRecommendation={handleGenerateRecommendation}
          onGenerateSyntheticData={handleGenerateSyntheticData}
        />
        
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Table Name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <Box component="span" sx={{ cursor: 'pointer', p: 1 }}>
                    ×
                  </Box>
                ),
              }}
            />
          </Box>

          <MetadataTable tableName={tableName} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
