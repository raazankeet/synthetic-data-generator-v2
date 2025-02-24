"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RecommendIcon from '@mui/icons-material/Recommend';
import StorageIcon from '@mui/icons-material/Storage';
import AppLayout from '@/app/components/AppLayout';
import MetadataTable from '@/app/components/MetadataTable';
import { TableMetadataResponse, fetchTableMetadata } from '@/lib/api/tableApi';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import Notification from '@/app/components/Notification';
import { fetchGeneratorRecommendations } from '@/lib/api/recommendationApi';
import { RecommendationResponse, TableRecommendation, GeneratorRecommendation } from '@/lib/types';
import { GeneratorOptionType } from '@/lib/constants/GeneratorOptions';

// First, let's define the error response type
type ApiErrorResponse = {
  error: string;
};

export default function Home() {
  const [tableName, setTableName] = useState('');
  const [metadata, setMetadata] = useState<TableMetadataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
  }>({
    open: false,
    message: '',
    type: 'info'
  });
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [generatorSelections, setGeneratorSelections] = useState<{
    [key: string]: GeneratorOptionType;
  }>({});

  useEffect(() => {
    console.log('isConfirmOpen changed:', isConfirmOpen);
  }, [isConfirmOpen]);

  const handleScanMetadata = async () => {
    try {
      console.log('Starting metadata scan for table:', tableName);
      setIsLoading(true);
      setMetadata(null);
      setError(null);
      
      const data = await fetchTableMetadata(tableName);
      console.log('API Response:', data);
      
      setMetadata(data);
      setNotification({
        open: true,
        message: 'Metadata fetched successfully',
        type: 'success'
      });

    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setNotification({
        open: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanClick = () => {
    console.log('Scan button clicked, setting isConfirmOpen to true');
    setIsConfirmOpen(true);
  };

  const handleGeneratorChange = useCallback((columnName: string, value: GeneratorOptionType) => {
    console.log('Changing generator for:', columnName, 'to:', value);
    setGeneratorSelections(prev => {
      const newSelections = {
        ...prev,
        [columnName]: value
      };
      console.log('New generator selections:', newSelections);
      return newSelections;
    });
  }, []);

  const handleGenerateRecommendation = async () => {
    if (!metadata) {
      setNotification({
        open: true,
        message: 'Please scan metadata first before generating recommendations',
        type: 'warning'
      });
      return;
    }

    try {
      setIsLoadingRecommendation(true);
      const recommendations = await fetchGeneratorRecommendations(metadata);
      console.log('Received recommendations:', recommendations);
      
      setRecommendations(recommendations);

      // Update generator selections based on recommendations
      setGeneratorSelections(prev => {
        const newSelections = { ...prev };
        
        // Process central table recommendations
        recommendations.central_table_metadata.forEach((table) => {
          table.columns.forEach((col) => {
            if (col.confidence >= 90 && col.generator !== 'not known' && !prev[col.COLUMN_NAME]) {
              newSelections[col.COLUMN_NAME] = col.generator as GeneratorOptionType;
            }
          });
        });

        console.log('New generator selections after recommendations:', newSelections);
        return newSelections;
      });
      
      setNotification({
        open: true,
        message: 'Generator recommendations applied successfully',
        type: 'success'
      });

    } catch (error) {
      console.error('Error generating recommendations:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to generate recommendations',
        type: 'error'
      });
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const handleGenerateSyntheticData = () => {
    console.log('Generating synthetic data...');
  };

  const confirmMessage = metadata 
    ? "This will clear the current metadata and fetch new data. Are you sure?"
    : "Are you sure you want to scan the database to fetch metadata? This action may take a few moments.";

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      {/* Dialogs and Notifications should be outside AppLayout */}
      <ConfirmDialog
        open={isConfirmOpen}
        title="Scan Metadata?"
        message={confirmMessage}
        onConfirm={() => {
          console.log('Confirm callback triggered');
          setIsConfirmOpen(false);
          handleScanMetadata();
        }}
        onCancel={() => {
          console.log('Cancel callback triggered');
          setIsConfirmOpen(false);
        }}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />

      <AppLayout>
        {/* Search Section */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          px: 3,
          py: 2,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            width: '100%',
          }}>
            {/* Search Field */}
            <TextField
              placeholder="Table Name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              disabled={isLoading}
              InputProps={{
                endAdornment: tableName && (
                  <IconButton 
                    size="small" 
                    onClick={() => setTableName('')}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              sx={{
                width: '300px',
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            {/* Buttons */}
            <Button 
              variant="contained"
              startIcon={<QrCodeScannerIcon />}
              onClick={handleScanClick}
              disabled={isLoading}
              sx={{
                bgcolor: '#6B46C1',
                '&:hover': { bgcolor: '#553C9A' }
              }}
            >
              SCAN METADATA
            </Button>

            <Button 
              variant="contained"
              startIcon={<RecommendIcon />}
              onClick={handleGenerateRecommendation}
              disabled={isLoadingRecommendation || !metadata}
              sx={{
                bgcolor: '#6B46C1',
                '&:hover': { bgcolor: '#553C9A' }
              }}
            >
              {isLoadingRecommendation ? 'GENERATING...' : 'GENAI RECOMMENDATION'}
            </Button>

            <Button 
              variant="contained"
              startIcon={<StorageIcon />}
              onClick={handleGenerateSyntheticData}
              sx={{
                bgcolor: '#6B46C1',
                '&:hover': { bgcolor: '#553C9A' }
              }}
            >
              GENERATE SYNTHETIC DATA
            </Button>
          </Box>
        </Box>

        {/* Table Content */}
        <Box sx={{
          width: '100%',
          maxWidth: '1600px',
          mx: 'auto',
          px: 3,
          flex: 1,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          {metadata && (
            <MetadataTable 
              metadata={metadata} 
              recommendations={recommendations}
              generatorSelections={generatorSelections}
              onGeneratorChange={handleGeneratorChange}
            />
          )}
          {isLoading && !metadata && <LoadingSpinner />}
          {error && (
            <Box sx={{ color: 'error.main', p: 2 }}>
              Error: {error}
            </Box>
          )}
          {!metadata && !isLoading && !error && (
            <Box sx={{ p: 2, color: 'text.secondary' }}>
              Click "SCAN METADATA" to fetch table metadata
            </Box>
          )}
        </Box>
      </AppLayout>
    </>
  );
}
