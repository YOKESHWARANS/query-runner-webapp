import React, { useMemo } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Chip
} from '@mui/material';

function QuerySelector({ queries, selectedQuery, onQueryChange }) {
  // Memoize and deduplicate queries
  const uniqueQueries = useMemo(() => {
    const seen = new Set();
    return queries.filter(query => {
      const duplicate = seen.has(query.id);
      seen.add(query.id);
      return !duplicate;
    });
  }, [queries]);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      minWidth: 300, 
      mb: 2 
    }}>
      <FormControl fullWidth>
        <InputLabel>Select Query</InputLabel>
        <Select
          value={selectedQuery?.id || ''}
          label="Select Query"
          onChange={(e) => {
            const selected = uniqueQueries.find(q => q.id === e.target.value);
            onQueryChange(selected);
          }}
          renderValue={(selectedId) => {
            const selected = uniqueQueries.find(q => q.id === selectedId);
            return (
              <Chip 
                label={selected?.name || 'Select a query'} 
                color="primary" 
                variant="outlined"
              />
            );
          }}
        >
          {uniqueQueries.map((query) => (
            <MenuItem key={query.id} value={query.id}>
              {query.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default QuerySelector;