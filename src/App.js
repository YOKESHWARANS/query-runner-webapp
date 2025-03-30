import React, { Suspense, lazy, useState, useCallback, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { queryData } from './data/mockData';
import QuerySelector from './components/QuerySelector';
import ErrorBoundary from './components/ErrorBoundary';
import useQueryHistory from './hooks/useQueryHistory';

const ResultsTable = lazy(() => import('./components/ResultsTable'));
const CustomQueryInput = lazy(() => import('./components/CustomQueryInput'));
const PerformanceTracker = lazy(() => import('./components/PerformanceTracker'));
const DataVisualization = lazy(() => import('./components/DataVisualization'));
const SQLSyntaxHighlighter = lazy(() => import('./components/SQLSyntaxHighlighter'));

function App() {
  // Theme state
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Theme toggle function
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Create theme based on current mode
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'light' ? '#1976d2' : '#90caf9',
        },
        secondary: {
          main: mode === 'light' ? '#dc004e' : '#f48fb1',
        },
      },
      typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
      },
    }),
    [mode]
  );
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [error, setError] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState('');
  const { queryHistory, addToHistory, clearHistory } = useQueryHistory();

  const handleQueryChange = useCallback((query) => {
    try {
      setSelectedQuery(query);
      addToHistory(query);
      setError(null);
    } catch (err) {
      setError('Error processing query: ' + err.message);
    }
  }, [addToHistory]);

  const handleCustomQuery = useCallback((customQuery) => {
    try {
      if (!customQuery || !customQuery.query) {
        throw new Error('Invalid query format');
      }
      setSelectedQuery(customQuery);
      addToHistory(customQuery);
      setError(null);
    } catch (err) {
      setError('Error with custom query: ' + err.message);
    }
  }, [addToHistory]);

  const handleCloseError = () => {
    setError(null);
  };

  const handleExport = () => {
    if (selectedQuery) {
      const fileName = exportFileName || `query_results_${Date.now()}`;
      
      const csvContent = selectedQuery.data.map(row => 
        Object.values(row).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close the export modal
      setIsExportModalOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Box sx={{ my: 4 }}>
            <AppBar position="static" sx={{ mb: 3, borderRadius: 1 }}>
              <Toolbar sx={{ flexWrap: 'wrap' }}>
                <Typography 
                  variant="h6" 
                  component="h1" 
                  sx={{ 
                    flexGrow: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Atlan SQL Query Viewer
                </Typography>
                <IconButton
                  onClick={toggleColorMode}
                  color="inherit"
                  aria-label="toggle dark/light mode"
                  edge="end"
                >
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Toolbar>
            </AppBar>
            
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
              <Suspense fallback={<div>Loading...</div>}>
                <CustomQueryInput onRunCustomQuery={handleCustomQuery} />
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'stretch', sm: 'center' }, 
                    gap: 2,
                    mb: 2 
                  }}
                >
                  <QuerySelector 
                    queries={[...queryData, ...queryHistory]}
                    selectedQuery={selectedQuery}
                    onQueryChange={handleQueryChange}
                  />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={clearHistory}
                      size={isMobile ? "small" : "medium"}
                    >
                      Clear History
                    </Button>
                    {selectedQuery && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setIsExportModalOpen(true)}
                        size={isMobile ? "small" : "medium"}
                      >
                        Export CSV
                      </Button>
                    )}
                  </Box>
                </Box>
                
                {selectedQuery && (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Query Details
                      </Typography>
                      <SQLSyntaxHighlighter query={selectedQuery.query} />
                    </Box>
                    
                    <ResultsTable queryData={selectedQuery} />
                    <PerformanceTracker queryData={selectedQuery} />
                    <DataVisualization queryData={selectedQuery} />
                  </>
                )}
              </Suspense>
            </Paper>
          </Box>

          {/* Export Modal */}
          <Dialog 
            open={isExportModalOpen} 
            onClose={() => setIsExportModalOpen(false)}
          >
            <DialogTitle>Export Query Results</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="File Name"
                fullWidth
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                placeholder={`query_results_${Date.now()}`}
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setIsExportModalOpen(false)} 
                color="secondary"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleExport} 
                color="primary"
              >
                Export
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseError} 
              severity="error" 
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
        </Container>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;