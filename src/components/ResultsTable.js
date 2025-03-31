import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Default data for customers table preview
const defaultCustomersData = [
  { customer_id: 1, customer_name: 'Yokesh', email: 'yokesh@example.com', total_purchases: 5500, join_date: '2023-01-15' },
  { customer_id: 2, customer_name: 'Deepak krishna', email: 'deepak@example.com', total_purchases: 4800, join_date: '2023-02-20' },
  { customer_id: 3, customer_name: 'Sundar V', email: 'sundar@example.com', total_purchases: 4200, join_date: '2023-03-10' },
  { customer_id: 4, customer_name: 'Gokula krishnan', email: 'gokula@example.com', total_purchases: 3900, join_date: '2023-04-05' },
  { customer_id: 5, customer_name: 'Tharun P', email: 'tharun@example.com', total_purchases: 3500, join_date: '2023-05-18' }
];

const ResultsTable = ({ queryData, isDefaultView = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If default view is true, show customers table preview
  const dataToDisplay = isDefaultView ? defaultCustomersData : (queryData?.data || []);
  
  // Format data values for display
  const formatCellValue = (column, value) => {
    if (value === null || value === undefined) return '-';
    if (column.includes('date') && typeof value === 'string') {
      return new Date(value).toLocaleDateString();
    }
    if (column.includes('price') || column.includes('purchases') || column.includes('amount')) {
      return typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value;
    }
    return value;
  };

  // Format column names for display
  const formatColumnName = (column) => {
    return column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // No data to display
  if (dataToDisplay.length === 0) {
    return (
      <Box sx={{ my: 2, p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body1" align="center">No data available for this query.</Typography>
      </Box>
    );
  }

  // Get column headers from the first data entry
  const columns = Object.keys(dataToDisplay[0]);
  
  // For mobile, limit the number of columns shown
  const visibleColumns = isMobile ? columns.slice(0, 3) : columns;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 500, 
          mb: 2,
          fontSize: isMobile ? '1rem' : '1.25rem'
        }}
      >
        {isDefaultView ? 'Customers Table Preview' : 'Query Results'}
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 2, 
          maxHeight: { xs: 300, sm: 350, md: 400 }, 
          overflow: 'auto',
          boxShadow: 2,
          borderRadius: 1
        }}
      >
        <Table stickyHeader aria-label="results table" size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell 
                  key={column} 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: theme.palette.primary.main, 
                    color: theme.palette.primary.contrastText,
                    whiteSpace: 'nowrap',
                    padding: isMobile ? '8px' : '16px'
                  }}
                >
                  {formatColumnName(column)}
                </TableCell>
              ))}
              {isMobile && columns.length > 3 && (
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: theme.palette.primary.main, 
                    color: theme.palette.primary.contrastText,
                    whiteSpace: 'nowrap',
                    padding: '8px'
                  }}
                >
                  More
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataToDisplay.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                sx={{ 
                  '&:nth-of-type(odd)': { 
                    backgroundColor: theme => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)' 
                  },
                  '&:hover': {
                    backgroundColor: theme => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'
                  }
                }}
              >
                {visibleColumns.map((column) => (
                  <TableCell 
                    key={`${rowIndex}-${column}`}
                    sx={{ padding: isMobile ? '8px' : '16px' }}
                  >
                    {formatCellValue(column, row[column])}
                  </TableCell>
                ))}
                {isMobile && columns.length > 3 && (
                  <TableCell sx={{ padding: '8px', color: theme.palette.primary.main }}>
                    •••
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}
      >
        <span>{dataToDisplay.length} {dataToDisplay.length === 1 ? 'row' : 'rows'} returned</span>
        {!isDefaultView && (
          <span>Execution time: {queryData?.executionTime || '0'} ms</span>
        )}
      </Typography>
    </Box>
  );
};

export default ResultsTable;