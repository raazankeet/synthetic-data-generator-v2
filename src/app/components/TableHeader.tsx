"use client";

import { Box, Typography, Paper } from '@mui/material';

interface TableHeaderProps {
  table: string;
  totalRows: number;
  isChild?: boolean;
}

const TableHeader = ({ table, totalRows, isChild }: TableHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      <Typography variant="subtitle1" component="span">
        {table}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: '12px',
        }}
      >
        {totalRows}
      </Typography>
    </Box>
  );
};

export default TableHeader; 