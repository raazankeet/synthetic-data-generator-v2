"use client";

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Tooltip } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { ColumnMetadata, GeneratorOptionType } from '@/lib/types';
import { GeneratorOptions } from '@/lib/constants/GeneratorOptions';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { AutoFixHighIcon } from '@mui/icons-material';

interface ColumnMetadataWithRecommendation extends ColumnMetadata {
  recommendation?: {
    generator: string;
    confidence: number;
  } | null;
}

interface ColumnTableProps {
  columns: ColumnMetadataWithRecommendation[];
  generatorSelections: { [key: string]: GeneratorOptionType };
  recommendations?: { [key: string]: { generator: string; confidence: number } };
  handleGeneratorChange: (columnName: string, value: GeneratorOptionType) => void;
  renderDetailPanel?: (props: { row: any }) => React.ReactNode;
}

const ColumnTable = ({ 
  columns, 
  generatorSelections = {},
  recommendations,
  handleGeneratorChange,
  renderDetailPanel 
}: ColumnTableProps) => {
  const { isDarkMode } = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  // Debug the recommendations
  useEffect(() => {
    console.log('ColumnTable received recommendations:', recommendations);
    if (recommendations) {
      columns.forEach(col => {
        console.log(`Column ${col.COLUMN_NAME} recommendation:`, recommendations[col.COLUMN_NAME]);
      });
    }
  }, [recommendations, columns]);

  const tableColumns = useMemo<MRT_ColumnDef<ColumnMetadataWithRecommendation>[]>(
    () => [
      {
        id: 'column_name',
        accessorKey: 'COLUMN_NAME',
        header: 'Column Name',
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {row.original.COLUMN_NAME}
            {row.original.PRIMARY_KEY && (
              <Typography
                component="span"
                sx={{
                  bgcolor: '#ED8936',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                PK
              </Typography>
            )}
            {!row.original.NULLABLE && (
              <Typography
                component="span"
                sx={{
                  bgcolor: '#48BB78',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                NN
              </Typography>
            )}
          </Box>
        ),
      },
      {
        id: 'data_type_info',
        accessorFn: (row) => `${row.DATA_TYPE}${row.CHARACTER_MAXIMUM_LENGTH ? `(${row.CHARACTER_MAXIMUM_LENGTH})` : ''}`,
        header: 'Data Type',
        Cell: ({ row }) => {
          const dataType = row.original.DATA_TYPE;
          const maxLength = row.original.CHARACTER_MAXIMUM_LENGTH;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>
                {dataType}
                {maxLength && (
                  <Typography
                    component="span"
                    sx={{
                      color: 'text.secondary',
                      ml: 0.5,
                    }}
                  >
                    ({maxLength})
                  </Typography>
                )}
              </Typography>
            </Box>
          );
        },
      },
      {
        id: 'ai_recommendation',
        header: 'AI Recommendation',
        size: 200,
        Cell: ({ row }) => {
          const recommendation = row.original.recommendation;
          if (!recommendation || recommendation.generator === 'not known') {
            return <Box>-</Box>;
          }

          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 500
            }}>
              {GeneratorOptions[recommendation.generator as GeneratorOptionType] || recommendation.generator}
            </Box>
          );
        },
      },
      {
        id: 'confidence_score',
        header: 'Confidence Score',
        size: 150,
        Cell: ({ row }) => {
          const recommendation = row.original.recommendation;
          if (!recommendation || recommendation.confidence === 0) {
            return <Box>-</Box>;
          }

          return (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: recommendation.confidence > 80 ? 'success.light' : 'warning.light',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem',
              color: 'white',
              width: 'fit-content'
            }}>
              {recommendation.confidence}%
            </Box>
          );
        },
      },
      {
        id: 'generator',
        header: 'Selected Generator',
        size: 250,
        Cell: ({ row }) => {
          if (!row?.original?.COLUMN_NAME) {
            return <Box>-</Box>;
          }

          const columnName = row.original.COLUMN_NAME;
          
          return (
            <Select
              value={generatorSelections[columnName] || ''}
              onChange={(e) => {
                if (handleGeneratorChange) {
                  handleGeneratorChange(columnName, e.target.value as GeneratorOptionType);
                }
              }}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.entries(GeneratorOptions).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },
    ],
    [generatorSelections, handleGeneratorChange]
  );

  // Handle full screen toggle
  const handleFullScreenChange = () => {
    setIsMaximized(!isMaximized);
  };

  // Update page size when maximized state changes
  useEffect(() => {
    setPageSize(isMaximized ? 30 : 5);
  }, [isMaximized]);

  return (
    <MaterialReactTable
      columns={tableColumns}
      data={columns}
      enableExpanding
      enablePagination={true}
      enableColumnFilters
      enableTopToolbar
      enableBottomToolbar
      enableColumnActions
      enableColumnDragging
      enableSorting
      enableGlobalFilter
      enableFullScreenToggle
      enableDensityToggle
      enableHiding
      enableRowVirtualization
      onFullScreenChange={handleFullScreenChange}
      initialState={{ 
        density: 'compact',
        pagination: {
          pageSize: 5,
          pageIndex: 0,
        },
        sorting: [{ id: 'column_name', desc: false }]
      }}
      state={{
        pagination: {
          pageSize,
          pageIndex: 0,
        }
      }}
      onPaginationChange={(updater) => {
        // Handle pagination changes from the table
        if (typeof updater === 'function') {
          const newState = updater({
            pageIndex: 0,
            pageSize: pageSize
          });
          setPageSize(newState.pageSize);
        }
      }}
      muiTableContainerProps={{
        sx: { 
          maxHeight: isMaximized ? '80vh' : '400px',
          transition: 'all 0.3s ease',
          '& .MuiTableRow-root:hover': {
            bgcolor: 'grey.50',
          },
        }
      }}
      muiTableProps={{
        sx: {
          tableLayout: 'fixed',
          border: '1px solid rgba(224, 224, 224, 1)',
        }
      }}
      muiTableBodyRowProps={{
        sx: {
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.04)',
            transform: 'translateX(4px)'
          }
        }
      }}
      muiExpandButtonProps={{
        sx: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            bgcolor: 'rgba(0,0,0,0.04)'
          }
        }
      }}
      renderDetailPanel={({ row }) => (
        <Box sx={{ 
          animation: 'slideIn 0.3s ease',
          overflow: 'hidden'
        }}>
          {renderDetailPanel({ row })}
        </Box>
      )}
    />
  );
};

export default ColumnTable; 