"use client";

import { Box, Typography } from '@mui/material';
import { TableInfo, TableMetadataResponse } from '@/lib/types';
import TableRow from './TableRow';

interface TableSectionProps {
  title: string;
  tables: TableInfo[];
  isChild?: boolean;
  metadata: TableMetadataResponse;
  states: {
    recordsToGenerate: { [key: string]: number };
    newKeysReuse: { [key: string]: number };
    expandedTables: { [key: string]: boolean };
    generatorSelections: { [key: string]: GeneratorOptionType };
  };
  handlers: {
    handleRecordsChange: (tableName: string, value: string) => void;
    handleReuseChange: (tableName: string, value: number) => void;
    handleGeneratorChange: (columnName: string, value: GeneratorOptionType) => void;
    toggleTableExpansion: (tableName: string) => void;
  };
}

const TableSection = ({ 
  title, 
  tables, 
  isChild = false,
  metadata,
  states,
  handlers
}: TableSectionProps) => {
  return (
    <Box sx={{ mb: isChild ? 0 : 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {tables.map((table) => (
        <TableRow
          key={table.table_name}
          table={table}
          isChild={isChild}
          metadata={metadata}
          states={states}
          handlers={handlers}
        />
      ))}
    </Box>
  );
};

export default TableSection; 