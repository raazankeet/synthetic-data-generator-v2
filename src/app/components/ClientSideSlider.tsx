"use client";

import { Box, Slider } from '@mui/material';
import { useState, useEffect } from 'react';

interface ClientSideSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ClientSideSlider = ({ value, onChange }: ClientSideSliderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ width: 100, height: 20 }} /> // Placeholder while mounting
    );
  }

  return (
    <Box sx={{ width: 100 }}>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={0}
        max={100}
        size="small"
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
          }
        }}
      />
    </Box>
  );
};

export default ClientSideSlider; 