// Add these types
export interface ColumnMetadata {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH?: number;
  NULLABLE: boolean;
  PRIMARY_KEY: boolean;
  COLUMN_COMMENT?: string;
}

export interface TableInfo {
  table_name: string;
  total_rows: number;
  columns: ColumnMetadata[];
}

export interface TableMetadataResponse {
  central_table_metadata: TableInfo[];
  child_tables_metadata: TableInfo[];
  constraint_details: Array<{
    ConstraintName: string;
    ChildTable: string;
    ChildColumn: string;
    ReferencedTable: string;
    ReferencedColumn: string;
  }>;
}

export interface GeneratorRecommendation {
  COLUMN_NAME: string;
  confidence: number;
  generator: string;
}

export interface TableRecommendation {
  table_name: string;
  columns: GeneratorRecommendation[];
}

export interface RecommendationResponse {
  central_table_metadata: TableRecommendation[];
  parent_tables_metadata: TableRecommendation[];
  child_tables_metadata: TableRecommendation[];
} 