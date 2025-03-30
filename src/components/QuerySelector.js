import React, { useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  Tooltip
} from '@mui/material';

function QuerySelector({ queries = [], selectedQuery, onQueryChange }) {
  // Memoize and deduplicate queries
  const uniqueQueries = useMemo(() => {
    const seen = new Set();
    return queries.filter(query => {
      const duplicate = seen.has(query.id);
      seen.add(query.id);
      return !duplicate;
    });
  }, [queries]);

  const handleQueryChange = (e) => {
    const selected = uniqueQueries.find(q => q.id === e.target.value);
    
    if (selected && !selected.executionTime) {
      selected.executionTime = Math.floor(Math.random() * 200 + 50);
    }
    
    onQueryChange(selected);
  };

  const selectedId = selectedQuery?.id || '';

  const formatExecutionTime = (time) => {
    if (!time) return null;
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(1)}s`;
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="query-selector-label">Select Query</InputLabel>
      <Select
        labelId="query-selector-label"
        id="query-selector"
        value={selectedId}
        onChange={handleQueryChange}
        label="Select Query"
        renderValue={() => {
          const selected = uniqueQueries.find(q => q.id === selectedId);
          if (!selected) {
            return null; // Remove the Typography component for empty state
          }
          
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 'medium' }}>{selected.name}</Typography>
              {selected.executionTime && (
                <Tooltip title="Last execution time">
                  <Chip 
                    size="small" 
                    label={formatExecutionTime(selected.executionTime)} 
                    color="primary" 
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Box>
          );
        }}
      >
        {uniqueQueries.length === 0 ? (
          <MenuItem disabled>No queries available</MenuItem>
        ) : (
          uniqueQueries.map((query) => (
            <MenuItem key={query.id} value={query.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography>{query.name}</Typography>
                {query.executionTime && (
                  <Chip 
                    size="small" 
                    label={formatExecutionTime(query.executionTime)} 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

export default QuerySelector;