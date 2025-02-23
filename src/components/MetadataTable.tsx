import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Typography, Tabs, Tab } from '@mui/material';
import { ExportToCsv } from 'export-to-csv';
import { ColumnMetadata, TableMetadataResponse, ConstraintDetail, fetchTableMetadata } from '../lib/api/tableApi';

interface MetadataTableProps {
  tableName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MetadataTable: React.FC<MetadataTableProps> = ({ tableName }) => {
  const [metadata, setMetadata] = useState<TableMetadataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTableMetadata(tableName);
        setMetadata(data);
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

  const constraintColumns = useMemo<MRT_ColumnDef<ConstraintDetail>[]>(
    () => [
      {
        accessorKey: 'ConstraintName',
        header: 'Constraint Name',
      },
      {
        accessorKey: 'ChildTable',
        header: 'Child Table',
      },
      {
        accessorKey: 'ChildColumn',
        header: 'Child Column',
      },
      {
        accessorKey: 'ReferencedTable',
        header: 'Referenced Table',
      },
      {
        accessorKey: 'ReferencedColumn',
        header: 'Referenced Column',
      },
    ],
    []
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportData = () => {
    if (!metadata) return;
    
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `${tableName}_metadata`,
    };
    
    const csvExporter = new ExportToCsv(csvOptions);
    const currentTable = metadata.central_table_metadata[0];
    if (currentTable) {
      csvExporter.generateCsv(currentTable.columns);
    }
  };

  if (error) {
    return <Box sx={{ color: 'error.main', p: 2 }}>Error: {error}</Box>;
  }

  if (!metadata) {
    return null;
  }

  const currentTable = metadata.central_table_metadata[0];

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Columns" />
          <Tab label="Relationships" />
          <Tab label="Child Tables" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            Table: {currentTable?.table_name} ({currentTable?.total_rows} rows)
          </Typography>
        </Box>
        <MaterialReactTable
          columns={columns}
          data={currentTable?.columns || []}
          state={{ isLoading }}
          enableRowSelection
          enableColumnFilters
          enableColumnOrdering
          enablePinning
          enableColumnResizing
          enableStickyHeader
          renderTopToolbarCustomActions={() => (
            <Button
              color="primary"
              onClick={handleExportData}
              variant="contained"
            >
              Export to CSV
            </Button>
          )}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <MaterialReactTable
          columns={constraintColumns}
          data={metadata.constraint_details}
          enableRowSelection
          enableColumnFilters
          enableColumnOrdering
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {metadata.child_tables_metadata.map((childTable) => (
          <Box key={childTable.table_name} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {childTable.table_name} ({childTable.total_rows} rows)
            </Typography>
            <MaterialReactTable
              columns={columns}
              data={childTable.columns}
              enableRowSelection
              enableColumnFilters
              enableColumnOrdering
            />
          </Box>
        ))}
      </TabPanel>
    </Box>
  );
};

export default MetadataTable; 