"use client";

import { Box, Typography, TextField, IconButton, Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClientSideSlider from './ClientSideSlider';

interface TableControlsProps {
  table: string;
  recordsToGenerate: number;
  newKeysReuse: number;
  isExpanded: boolean;
  onRecordsChange: (tableName: string, value: string) => void;
  onReuseChange: (tableName: string, value: number) => void;
  onToggleExpand: () => void;
}

const TableControls = ({
  table,
  recordsToGenerate,
  newKeysReuse,
  isExpanded,
  onRecordsChange,
  onReuseChange,
  onToggleExpand,
}: TableControlsProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Number of records to generate for this table" arrow placement="top">
          <Typography variant="body2" sx={{ cursor: 'help' }}>
            Records to Generate:
          </Typography>
        </Tooltip>
        <TextField
          size="small"
          value={recordsToGenerate}
          onChange={(e) => onRecordsChange(table, e.target.value)}
          sx={{ width: '80px' }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Percentage of new keys to reuse from existing data" arrow placement="top">
          <Typography variant="body2" sx={{ cursor: 'help' }}>
            New Keys Reuse %:
          </Typography>
        </Tooltip>
        <ClientSideSlider
          value={newKeysReuse}
          onChange={(value) => onReuseChange(table, value)}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Clear existing data before loading new data" arrow placement="top">
          <Typography variant="body2" sx={{ cursor: 'help' }}>
            Truncate Load
          </Typography>
        </Tooltip>
        <Tooltip title="Clear table data" arrow placement="top">
          <IconButton size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Enable/disable data generation for this table" arrow placement="top">
          <Typography variant="body2" sx={{ cursor: 'help' }}>
            Generate Data
          </Typography>
        </Tooltip>
        <Switch />
      </Box>

      <Tooltip title={isExpanded ? "Collapse table" : "Expand table"} arrow placement="top">
        <IconButton
          size="small"
          onClick={onToggleExpand}
          sx={{ 
            ml: 2,
            transition: 'all 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
              transform: isExpanded ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'
            }
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TableControls; 