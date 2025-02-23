import { useState, ChangeEvent } from 'react';
import { Box, TextField, Container, Typography } from '@mui/material';
import MetadataTable from './components/MetadataTable';

function App() {
  const [tableName, setTableName] = useState('member');

  const handleTableNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTableName(e.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Database Table Metadata Viewer
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Table Name"
            value={tableName}
            onChange={handleTableNameChange}
            variant="outlined"
            fullWidth
          />
        </Box>

        <MetadataTable tableName={tableName} />
      </Box>
    </Container>
  );
}

export default App; 