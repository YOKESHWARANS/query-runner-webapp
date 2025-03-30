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
  useMediaQuery,
  CircularProgress,
  Tooltip,
  TablePagination
} from '@mui/material';

function ResultsTable({ queryData, loading = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Add state for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // If loading, show a loading indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no data, show a message
  if (!queryData || !queryData.data || queryData.data.length === 0) {
    return (
      <Paper sx={{ width: '100%', p: 2, mb: 2 }}>
        <Typography variant="body1" align="center">
          No results to display
        </Typography>
      </Paper>
    );
  }

  const columns = Object.keys(queryData.data[0]);
  
  // Get paginated data
  const paginatedData = queryData.data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="div">
          {isMobile ? 'Results' : `Query: ${queryData.query}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {queryData.data.length} results found
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="results table" size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }}
                >
                  {column.replace(/_/g, ' ').toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
              >
                {columns.map((column) => {
                  const cellValue = row[column];
                  const displayValue = typeof cellValue === 'object' 
                    ? JSON.stringify(cellValue)
                    : String(cellValue);
                  
                  return (
                    <TableCell key={`${rowIndex}-${column}`}>
                      {displayValue.length > 50 ? (
                        <Tooltip title={displayValue}>
                          <Typography noWrap sx={{ maxWidth: 250 }}>
                            {displayValue.substring(0, 50)}...
                          </Typography>
                        </Tooltip>
                      ) : (
                        displayValue
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={queryData.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ResultsTable;