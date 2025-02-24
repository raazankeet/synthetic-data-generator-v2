import { TableMetadataResponse } from './api/tableApi';
import { GeneratorOptionType } from './constants/GeneratorOptions';

export interface ColumnMetadata {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  PRIMARY_KEY: boolean;
  NULLABLE: boolean;
  IDENTITY: boolean;
  COLUMN_COMMENT?: string;
}

export interface RelationshipInfo {
  type: 'Primary Key' | 'Foreign Key';
  description: string;
  constraintName: string;
}

export type { TableMetadataResponse, GeneratorOptionType }; 