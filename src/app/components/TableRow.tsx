"use client";

import { Box, Collapse } from '@mui/material';
import { TableInfo, TableMetadataResponse, ColumnMetadata, GeneratorOptionType } from '@/lib/types';
import TableHeader from './TableHeader';
import TableControls from './TableControls';
import ColumnTable from './ColumnTable';
import RelationshipPanel from './RelationshipPanel';
import { useEffect, useMemo } from 'react';
import { MOCK_RECOMMENDATIONS } from '@/lib/constants/MockRecommendations';

interface TableRowProps {
  table: TableInfo;
  isChild?: boolean;
  metadata: TableMetadataResponse;
  recommendations?: { [key: string]: { generator: string; confidence: number } };
  generatorSelections?: { [key: string]: GeneratorOptionType };
  onGeneratorChange: (columnName: string, value: GeneratorOptionType) => void;
  states: {
    recordsToGenerate: { [key: string]: number };
    newKeysReuse: { [key: string]: number };
    expandedTables: { [key: string]: boolean };
  };
  handlers: {
    handleRecordsChange: (tableName: string, value: string) => void;
    handleReuseChange: (tableName: string, value: number) => void;
    toggleTableExpansion: (tableName: string) => void;
  };
}

const TableRow = ({ 
  table, 
  isChild, 
  metadata, 
  recommendations,
  generatorSelections = {},
  onGeneratorChange,
  states,
  handlers
}: TableRowProps) => {
  // Auto-select generators only on first mount or when recommendations change
  useEffect(() => {
    // Skip if we already have selections for this table or if onGeneratorChange is not available
    if (!onGeneratorChange) return;

    const hasExistingSelections = Object.keys(generatorSelections || {}).some(key => 
      table.columns.some(col => col.COLUMN_NAME === key)
    );
    
    if (hasExistingSelections) {
      console.log(`Table ${table.table_name} already has selections`);
      return;
    }

    // Use real recommendations if available, otherwise use mock
    const recs = recommendations || MOCK_RECOMMENDATIONS[table.table_name];
    if (recs) {
      console.log(`Applying recommendations for table ${table.table_name}:`, recs);
      Object.entries(recs).forEach(([columnName, rec]) => {
        if (rec.confidence >= 90 && rec.generator !== 'not known' && !generatorSelections[columnName]) {
          try {
            onGeneratorChange(columnName, rec.generator as GeneratorOptionType);
          } catch (error) {
            console.error('Error auto-selecting generator:', error);
          }
        }
      });
    }
  }, [table.table_name, recommendations, onGeneratorChange, generatorSelections, table.columns]);

  // Merge recommendations with column data
  const columnsWithRecommendations = useMemo(() => {
    const recs = recommendations || MOCK_RECOMMENDATIONS[table.table_name] || {};

    return table.columns.map(column => ({
      ...column,
      recommendation: recs[column.COLUMN_NAME] || {
        generator: 'not known',
        confidence: 0
      }
    }));
  }, [table.table_name, table.columns, recommendations]);

  console.log(`Table ${table.table_name} columns with recommendations:`, columnsWithRecommendations);

  const getRelationshipInfo = (columnData: ColumnMetadata, tableName: string) => {
    const relationships = [];

    if (columnData.PRIMARY_KEY) {
      const childReferences = metadata.constraint_details.filter(
        constraint => 
          constraint.ReferencedTable === tableName && 
          constraint.ReferencedColumn === columnData.COLUMN_NAME
      );
      childReferences.forEach(rel => {
        relationships.push({
          type: 'Primary Key',
          description: `Referenced by ${rel.ChildTable}.${rel.ChildColumn}`,
          constraintName: rel.ConstraintName
        });
      });
    }

    const parentReferences = metadata.constraint_details.filter(
      constraint => 
        constraint.ChildTable === tableName && 
        constraint.ChildColumn === columnData.COLUMN_NAME
    );
    parentReferences.forEach(rel => {
      relationships.push({
        type: 'Foreign Key',
        description: `References ${rel.ReferencedTable}.${rel.ReferencedColumn}`,
        constraintName: rel.ConstraintName
      });
    });

    return relationships.length > 0 ? relationships : null;
  };

  const renderDetailPanel = ({ row }) => (
    <RelationshipPanel
      relationships={getRelationshipInfo(row.original, table.table_name)}
      comment={row.original.COLUMN_COMMENT}
    />
  );

  return (
    <Box sx={{ 
      mb: 1.5,
      width: '100%',
      transition: 'all 0.3s ease'
    }}>
      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        transition: 'all 0.3s ease',
        boxShadow: states.expandedTables[table.table_name] ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
      }}>
        <TableHeader 
          table={table.table_name} 
          totalRows={table.total_rows}
          isChild={isChild}
        />
        <TableControls
          table={table.table_name}
          recordsToGenerate={states.recordsToGenerate[table.table_name] || 10}
          newKeysReuse={states.newKeysReuse[table.table_name] || 0}
          isExpanded={states.expandedTables[table.table_name] || false}
          onRecordsChange={handlers.handleRecordsChange}
          onReuseChange={handlers.handleReuseChange}
          onToggleExpand={() => handlers.toggleTableExpansion(table.table_name)}
        />
      </Box>
      <Collapse 
        in={states.expandedTables[table.table_name]} 
        timeout={300}
        unmountOnExit
      >
        <ColumnTable
          columns={columnsWithRecommendations}
          generatorSelections={generatorSelections}
          recommendations={recommendations}
          handleGeneratorChange={onGeneratorChange}
          renderDetailPanel={renderDetailPanel}
        />
      </Collapse>
    </Box>
  );
};

export default TableRow; 