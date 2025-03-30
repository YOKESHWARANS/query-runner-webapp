import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';

function ResultsTable({ queryData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!queryData) return null;

  const columns = queryData.data.length > 0 ? Object.keys(queryData.data[0]) : [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isMobile ? 'Results' : `Query: ${queryData.query}`}
      </Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxWidth: '100%', 
          overflowX: 'auto' 
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ whiteSpace: 'nowrap', px: isMobile ? 1 : 2 }}>
                  {column.replace(/_/g, ' ').toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {queryData.data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column} sx={{ px: isMobile ? 1 : 2 }}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ResultsTable;