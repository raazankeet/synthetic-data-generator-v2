"use client";

import { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Paper, Switch, TextField, IconButton, Collapse, Slider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { ColumnMetadata, TableInfo, TableMetadataResponse, fetchTableMetadata } from '@/lib/api/tableApi';

interface MetadataTableProps {
  tableName: string;
}

// Add this interface for relationship type
interface RelationshipInfo {
  type: 'Primary Key' | 'Foreign Key';
  description: string;
  constraintName: string;
}

const MetadataTable: React.FC<MetadataTableProps> = ({ tableName }) => {
  const [metadata, setMetadata] = useState<TableMetadataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordsToGenerate, setRecordsToGenerate] = useState<{ [key: string]: number }>({});
  const [newKeysReuse, setNewKeysReuse] = useState<{ [key: string]: number }>({});
  const [expandedTables, setExpandedTables] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTableMetadata(tableName);
        setMetadata(data);
        
        const initialRecords: { [key: string]: number } = {};
        const initialReuse: { [key: string]: number } = {};
        const initialExpanded: { [key: string]: boolean } = {};
        
        // Central table
        if (data.central_table_metadata[0]) {
          const tableName = data.central_table_metadata[0].table_name;
          initialRecords[tableName] = 10;
          initialReuse[tableName] = 0;
          initialExpanded[tableName] = false;
        }
        
        // Child tables
        data.child_tables_metadata.forEach((table: TableInfo) => {
          initialRecords[table.table_name] = 10;
          initialReuse[table.table_name] = 0;
          initialExpanded[table.table_name] = false;
        });
        
        setRecordsToGenerate(initialRecords);
        setNewKeysReuse(initialReuse);
        setExpandedTables(initialExpanded);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [tableName]);

  const columns = useMemo<MRT_ColumnDef<ColumnMetadata>[]>(
    () => [
      {
        accessorKey: 'COLUMN_NAME',
        header: 'Column Name',
      },
      {
        accessorKey: 'DATA_TYPE',
        header: 'Data Type',
      },
      {
        accessorKey: 'CHARACTER_MAXIMUM_LENGTH',
        header: 'Max Length',
        Cell: ({ cell }) => (cell.getValue<number | null>() ?? 'N/A').toString(),
      },
      {
        accessorKey: 'PRIMARY_KEY',
        header: 'Primary Key',
        Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Yes' : 'No'),
      },
      {
        accessorKey: 'NULLABLE',
        header: 'Nullable',
        Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Yes' : 'No'),
      },
      {
        accessorKey: 'IDENTITY',
        header: 'Identity',
        Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Yes' : 'No'),
      },
      {
        accessorKey: 'COLUMN_COMMENT',
        header: 'Comment',
      },
    ],
    []
  );

  const handleRecordsChange = (tableName: string, value: string) => {
    setRecordsToGenerate(prev => ({
      ...prev,
      [tableName]: parseInt(value) || 0
    }));
  };

  const handleReuseChange = (tableName: string, value: number) => {
    setNewKeysReuse(prev => ({
      ...prev,
      [tableName]: value
    }));
  };

  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  if (error) {
    return <Box sx={{ color: 'error.main', p: 2 }}>Error: {error}</Box>;
  }

  if (!metadata || isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  const TableRow = ({ 
    table, 
    totalRows, 
    columns,
    isChild = false,
    metadata  // Add metadata prop
  }: { 
    table: string; 
    totalRows: number;
    columns: ColumnMetadata[];
    isChild?: boolean;
    metadata: TableMetadataResponse;
  }) => {
    const tableColumns = useMemo<MRT_ColumnDef<ColumnMetadata>[]>(
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
      ],
      []
    );

    // Updated getRelationshipInfo function
    const getRelationshipInfo = (columnData: ColumnMetadata): RelationshipInfo[] | null => {
      const relationships: RelationshipInfo[] = [];

      // Check if this column is a primary key being referenced by other tables
      if (columnData.PRIMARY_KEY) {
        const childReferences = metadata.constraint_details.filter(
          constraint => 
            constraint.ReferencedTable === table && 
            constraint.ReferencedColumn === columnData.COLUMN_NAME
        );

        // Add all child table references
        childReferences.forEach(rel => {
          relationships.push({
            type: 'Primary Key',
            description: `Referenced by ${rel.ChildTable}.${rel.ChildColumn}`,
            constraintName: rel.ConstraintName
          });
        });
      }

      // Check if this column is a foreign key referencing other tables
      const parentReferences = metadata.constraint_details.filter(
        constraint => 
          constraint.ChildTable === table && 
          constraint.ChildColumn === columnData.COLUMN_NAME
      );

      // Add all parent table references
      parentReferences.forEach(rel => {
        relationships.push({
          type: 'Foreign Key',
          description: `References ${rel.ReferencedTable}.${rel.ReferencedColumn}`,
          constraintName: rel.ConstraintName
        });
      });

      return relationships.length > 0 ? relationships : null;
    };

    return (
      <Box sx={{ mb: 2 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: isChild ? 'grey.100' : 'white',
            borderRadius: '8px',
          }}
        >
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Records to Generate:</Typography>
              <TextField
                size="small"
                value={recordsToGenerate[table] || 10}
                onChange={(e) => handleRecordsChange(table, e.target.value)}
                sx={{ width: '80px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">New Keys Reuse %:</Typography>
              <Box sx={{ width: 100 }}>
                <Slider
                  size="small"
                  value={newKeysReuse[table] || 0}
                  onChange={(_, value) => handleReuseChange(table, value as number)}
                  aria-label="New Keys Reuse"
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                      width: 14,
                      height: 14,
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.5,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Truncate Load</Typography>
              <IconButton size="small">
                <DeleteIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Generate Data</Typography>
              <Switch />
            </Box>

            <IconButton
              size="small"
              onClick={() => toggleTableExpansion(table)}
              sx={{ ml: 2 }}
            >
              {expandedTables[table] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </Paper>

        <Collapse in={expandedTables[table]} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
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
              muiTableContainerProps={{
                sx: { 
                  maxHeight: '400px',
                  '& .MuiTableRow-root:hover': {
                    bgcolor: 'grey.50',
                  },
                }
              }}
              muiTableProps={{
                sx: {
                  tableLayout: 'fixed',
                }
              }}
              muiExpandButtonProps={{
                sx: {
                  color: 'text.secondary',
                },
              }}
              renderDetailPanel={({ row }) => {
                const relationships = getRelationshipInfo(row.original);
                return (
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'grey.50',
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {/* Relationships Section - Show this first if exists */}
                    {relationships && relationships.length > 0 && (
                      <Box sx={{ mb: row.original.COLUMN_COMMENT ? 2 : 0 }}>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            mb: 1,
                          }}
                        >
                          Relationships:
                        </Typography>
                        {relationships.map((rel, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              ml: 2,
                              mb: 1,
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                color: rel.type === 'Primary Key' ? '#ED8936' : '#48BB78',
                                fontSize: '0.875rem',
                                fontWeight: 'medium',
                              }}
                            >
                              {rel.type}
                            </Typography>
                            <Typography
                              component="div"
                              sx={{ 
                                color: 'text.primary',
                                fontSize: '0.875rem',
                                ml: 1,
                              }}
                            >
                              {rel.description}
                            </Typography>
                            <Typography
                              component="div"
                              sx={{ 
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                ml: 1,
                              }}
                            >
                              Constraint: {rel.constraintName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Comment Section */}
                    {row.original.COLUMN_COMMENT && (
                      <Box>
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            mr: 1,
                          }}
                        >
                          Comment:
                        </Typography>
                        <Typography component="span">
                          {row.original.COLUMN_COMMENT}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Central Table</Typography>
        {metadata.central_table_metadata.map((table: TableInfo) => (
          <TableRow
            key={table.table_name}
            table={table.table_name}
            totalRows={table.total_rows}
            columns={table.columns}
            metadata={metadata}  // Pass metadata here
          />
        ))}
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Child Tables</Typography>
        {metadata.child_tables_metadata.map((table: TableInfo) => (
          <TableRow
            key={table.table_name}
            table={table.table_name}
            totalRows={table.total_rows}
            columns={table.columns}
            isChild
            metadata={metadata}  // Pass metadata here
          />
        ))}
      </Box>
    </Box>
  );
};

export default MetadataTable; 