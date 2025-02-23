export interface ColumnMetadata {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  PRIMARY_KEY: boolean;
  NULLABLE: boolean;
  IDENTITY: boolean;
  COLUMN_COMMENT: string;
}

export interface TableInfo {
  table_name: string;
  total_rows: number;
  columns: ColumnMetadata[];
}

export interface ConstraintDetail {
  ConstraintName: string;
  ChildTable: string;
  ChildColumn: string;
  ReferencedTable: string;
  ReferencedColumn: string;
}

export interface TableMetadataResponse {
  central_table_metadata: TableInfo[];
  parent_tables_metadata: TableInfo[];
  child_tables_metadata: TableInfo[];
  constraint_details: ConstraintDetail[];
}

export const fetchTableMetadata = async (tableName: string): Promise<TableMetadataResponse> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/metadata?table_name=${tableName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching table metadata:', error);
    throw error;
  }
}; 