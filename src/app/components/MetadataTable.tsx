"use client";

import { useState } from 'react';
import { Box } from '@mui/material';
import { TableMetadataResponse, GeneratorOptionType } from '@/lib/types';
import TableSection from './TableSection';

interface MetadataTableProps {
  metadata: TableMetadataResponse;
}

const MetadataTable: React.FC<MetadataTableProps> = ({ metadata }) => {
  const [recordsToGenerate, setRecordsToGenerate] = useState<{ [key: string]: number }>({});
  const [newKeysReuse, setNewKeysReuse] = useState<{ [key: string]: number }>({});
  const [expandedTables, setExpandedTables] = useState<{ [key: string]: boolean }>({});
  const [generatorSelections, setGeneratorSelections] = useState<{[key: string]: GeneratorOptionType}>({});

  const handlers = {
    handleRecordsChange: (tableName: string, value: string) => {
      setRecordsToGenerate(prev => ({
        ...prev,
        [tableName]: parseInt(value) || 0
      }));
    },
    handleReuseChange: (tableName: string, value: number) => {
      setNewKeysReuse(prev => ({
        ...prev,
        [tableName]: value
      }));
    },
    handleGeneratorChange: (columnName: string, value: GeneratorOptionType) => {
      setGeneratorSelections(prev => ({
        ...prev,
        [columnName]: value
      }));
    },
    toggleTableExpansion: (tableName: string) => {
      setExpandedTables(prev => ({
        ...prev,
        [tableName]: !prev[tableName]
      }));
    }
  };

  const states = {
    recordsToGenerate,
    newKeysReuse,
    expandedTables,
    generatorSelections
  };

  return (
    <Box sx={{ p: 2 }}>
      <TableSection
        title="Central Table"
        tables={metadata.central_table_metadata}
        metadata={metadata}
        states={states}
        handlers={handlers}
      />
      <TableSection
        title="Child Tables"
        tables={metadata.child_tables_metadata}
        isChild
        metadata={metadata}
        states={states}
        handlers={handlers}
      />
    </Box>
  );
};

export default MetadataTable;