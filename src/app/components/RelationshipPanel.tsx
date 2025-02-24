"use client";

import { Box, Typography } from '@mui/material';
import { RelationshipInfo } from '@/lib/types';

interface RelationshipPanelProps {
  relationships: RelationshipInfo[] | null;
  comment?: string;
}

const RelationshipPanel = ({ relationships, comment }: RelationshipPanelProps) => {
  return (
    <Box 
      sx={{ 
        p: 2, 
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider',
        animation: 'fadeIn 0.3s ease',
        '& > *': {
          animation: 'slideIn 0.3s ease'
        }
      }}
    >
      {relationships && relationships.length > 0 && (
        <Box sx={{ mb: comment ? 2 : 0 }}>
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

      {comment && (
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
            {comment}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RelationshipPanel; 