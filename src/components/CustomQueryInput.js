import React, { useState, useRef, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Tooltip,
  Typography,
  Collapse,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  CircularProgress,
  Snackbar,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HistoryIcon from '@mui/icons-material/History';
import ClearIcon from '@mui/icons-material/Clear';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';

function CustomQueryInput({ onRunCustomQuery }) {
  const [customQuery, setCustomQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const textFieldRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load saved queries and history from localStorage on component mount
  useEffect(() => {
    try {
      const savedQueriesFromStorage = localStorage.getItem('savedQueries');
      const queryHistoryFromStorage = localStorage.getItem('queryHistory');
      
      if (savedQueriesFromStorage) {
        setSavedQueries(JSON.parse(savedQueriesFromStorage));
      }
      
      if (queryHistoryFromStorage) {
        setQueryHistory(JSON.parse(queryHistoryFromStorage));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save queries and history to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
      localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [savedQueries, queryHistory]);

  const exampleQueries = [
    'SELECT customer_name, total_purchases FROM customers ORDER BY total_purchases DESC LIMIT 5',
    'SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department',
    'SELECT product_category, COUNT(*) as product_count FROM products GROUP BY product_category'
  ];

  const validateQuery = (query) => {
    if (!query.trim()) return 'Query cannot be empty';
    
    // More comprehensive validation
    const restrictedKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT', 'GRANT', 'REVOKE'];
    const upperQuery = query.toUpperCase();
    
    for (let keyword of restrictedKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`);
      if (regex.test(upperQuery)) {
        return `Potentially destructive keyword detected: ${keyword}`;
      }
    }

    // Basic syntax validation
    if (!upperQuery.includes('SELECT')) {
      return 'Query must include a SELECT statement';
    }

    return null;
  };

  const handleRunQuery = () => {
    const validationResult = validateQuery(customQuery);
    
    if (validationResult) {
      setValidationError(validationResult);
      return;
    }

    setValidationError(null);
    setIsRunning(true);
    
    // Start timing
    const startTime = performance.now();
    
    // Generate mock data
    const mockData = generateMockData(customQuery);
    
    // Add to query history (limit to 10 most recent)
    const timestamp = new Date().toLocaleString();
    const newQueryHistory = [
      { 
        query: customQuery, 
        timestamp, 
        preview: customQuery.substring(0, 40) + (customQuery.length > 40 ? '...' : '') 
      },
      ...queryHistory
    ].slice(0, 10);
    
    setQueryHistory(newQueryHistory);
    
    // Simulate database query delay with a more consistent experience
    setTimeout(() => {
      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);
      
      onRunCustomQuery({
        id: Date.now(),
        name: 'Custom Query',
        query: customQuery,
        data: mockData,
        executionTime: executionTime
      });
      
      setIsRunning(false);
      setShowSnackbar(true);
      setSnackbarMessage(`Query executed in ${executionTime}ms`);
    }, 300); // More consistent delay for better UX
  };

  const handleKeyDown = (e) => {
    // Execute query on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  const handlePasteExample = () => {
    const randomQuery = exampleQueries[Math.floor(Math.random() * exampleQueries.length)];
    setCustomQuery(randomQuery);
    textFieldRef.current?.focus();
  };

  const handleSaveQuery = () => {
    if (!customQuery.trim()) return;
    
    const isDuplicate = savedQueries.some(item => item.query === customQuery);
    
    if (!isDuplicate) {
      const newSavedQueries = [
        ...savedQueries,
        {
          id: Date.now(),
          query: customQuery,
          name: `Query ${savedQueries.length + 1}`,
          preview: customQuery.substring(0, 40) + (customQuery.length > 40 ? '...' : '')
        }
      ];
      setSavedQueries(newSavedQueries);
      setShowSnackbar(true);
      setSnackbarMessage('Query saved successfully');
    } else {
      setShowSnackbar(true);
      setSnackbarMessage('Query already saved');
    }
  };

  const handleUseQuery = (query) => {
    setCustomQuery(query);
    setShowHistory(false);
    // Focus the text field after setting the query
    setTimeout(() => textFieldRef.current?.focus(), 0);
  };

  const handleClearQuery = () => {
    setCustomQuery('');
    setValidationError(null);
    textFieldRef.current?.focus();
  };

  const generateMockData = (query) => {
    // Mock datasets for demonstration
    const mockDataSets = {
      'customers': [
        { customer_name: 'John Doe', total_purchases: 5500, last_purchase: '2025-03-15', customer_since: '2022-06-01' },
        { customer_name: 'Jane Smith', total_purchases: 4800, last_purchase: '2025-03-20', customer_since: '2021-04-12' },
        { customer_name: 'Mike Johnson', total_purchases: 4200, last_purchase: '2025-03-10', customer_since: '2023-01-15' },
        { customer_name: 'Sara Williams', total_purchases: 3900, last_purchase: '2025-02-28', customer_since: '2022-11-03' },
        { customer_name: 'Robert Chen', total_purchases: 3500, last_purchase: '2025-03-05', customer_since: '2020-09-22' }
      ],
      'employees': [
        { department: 'Sales', avg_salary: 65000, headcount: 12, turnover_rate: 0.15 },
        { department: 'Marketing', avg_salary: 60000, headcount: 8, turnover_rate: 0.12 },
        { department: 'Engineering', avg_salary: 85000, headcount: 20, turnover_rate: 0.08 },
        { department: 'HR', avg_salary: 58000, headcount: 5, turnover_rate: 0.10 },
        { department: 'Finance', avg_salary: 72000, headcount: 7, turnover_rate: 0.05 }
      ],
      'products': [
        { product_category: 'Electronics', product_count: 45, avg_price: 299.99, inventory_value: 13499.55 },
        { product_category: 'Clothing', product_count: 30, avg_price: 49.99, inventory_value: 1499.70 },
        { product_category: 'Books', product_count: 25, avg_price: 19.99, inventory_value: 499.75 },
        { product_category: 'Home & Kitchen', product_count: 35, avg_price: 79.99, inventory_value: 2799.65 },
        { product_category: 'Sports', product_count: 20, avg_price: 89.99, inventory_value: 1799.80 }
      ]
    };

    // Match tables mentioned in the query
    let matchedData = null;
    for (let key in mockDataSets) {
      if (query.toLowerCase().includes(key)) {
        matchedData = mockDataSets[key];
        break;
      }
    }

    if (!matchedData) {
      return [{ message: 'No matching table found. Available tables: customers, employees, products' }];
    }

    // Apply basic query transformations
    const upperQuery = query.toUpperCase();
    
    // Handle LIMIT clause
    if (upperQuery.includes('LIMIT')) {
      const limitMatch = upperQuery.match(/LIMIT\s+(\d+)/i);
      if (limitMatch && limitMatch[1]) {
        matchedData = matchedData.slice(0, parseInt(limitMatch[1], 10));
      }
    }
    
    // Handle ORDER BY DESC
    if (upperQuery.includes('ORDER BY') && upperQuery.includes('DESC')) {
      matchedData = [...matchedData].reverse();
    }
    
    return matchedData;
  };

  const renderQueryHistoryPanel = () => (
    <Collapse in={showHistory}>
      <Paper elevation={2} sx={{ mt: 2, mb: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Query History</Typography>
          
          {/* Recent Queries Section */}
          <Typography variant="subtitle2" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
            Recent Queries
          </Typography>
          {queryHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
              No query history yet
            </Typography>
          ) : (
            <List dense disablePadding>
              {queryHistory.map((item, index) => (
                <ListItem 
                  key={index} 
                  divider={index < queryHistory.length - 1}
                  sx={{ 
                    py: 0.5, 
                    px: 1,
                    '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
                  }}
                  onClick={() => handleUseQuery(item.query)}
                >
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {item.preview}
                      </Typography>
                    }
                    secondary={item.timestamp}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          {/* Saved Queries Section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
            <BookmarkIcon fontSize="small" sx={{ mr: 1 }} />
            Saved Queries
          </Typography>
          {savedQueries.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
              No saved queries yet
            </Typography>
          ) : (
            <List dense disablePadding>
              {savedQueries.map((item, index) => (
                <ListItem 
                  key={item.id} 
                  divider={index < savedQueries.length - 1}
                  sx={{ 
                    py: 0.5, 
                    px: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleUseQuery(item.query)}
                >
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {item.preview}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedQueries(savedQueries.filter(q => q.id !== item.id));
                        setShowSnackbar(true);
                        setSnackbarMessage('Query removed from saved queries');
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Collapse>
  );

  const renderHelpContent = () => (
    <Collapse in={showHelp}>
      <Paper elevation={2} sx={{ mt: 2, mb: 2, overflow: 'hidden' }}>
        <Alert severity="info" sx={{ borderRadius: 0 }}>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <CodeIcon fontSize="small" sx={{ mr: 1 }} />
              SQL Query Help
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Box flex={1} minWidth={200}>
                <Typography variant="subtitle2" gutterBottom>Available Tables</Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Box component="li">customers (customer_name, total_purchases, etc.)</Box>
                  <Box component="li">employees (department, avg_salary, etc.)</Box>
                  <Box component="li">products (product_category, product_count, etc.)</Box>
                </Box>
              </Box>
              
              <Box flex={1} minWidth={200}>
                <Typography variant="subtitle2" gutterBottom>Common SQL Commands</Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Box component="li"><code>SELECT</code> - retrieve columns</Box>
                  <Box component="li"><code>FROM</code> - specify table</Box>
                  <Box component="li"><code>WHERE</code> - filter results</Box>
                  <Box component="li"><code>GROUP BY</code> - aggregate data</Box>
                  <Box component="li"><code>ORDER BY</code> - sort results</Box>
                  <Box component="li"><code>LIMIT</code> - restrict results</Box>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                Keyboard shortcut: <Chip size="small" label="Ctrl+Enter" /> to run query
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Paper>
    </Collapse>
  );

  // Mobile layout
  const renderMobileLayout = () => (
    <>
      <TextField
        inputRef={textFieldRef}
        fullWidth
        variant="outlined"
        label="Enter SQL Query"
        value={customQuery}
        onChange={(e) => {
          setCustomQuery(e.target.value);
          setValidationError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder="e.g., SELECT * FROM customers WHERE total_purchases > 1000"
        multiline
        rows={3}
        error={!!validationError}
        helperText={validationError}
        sx={{ mb: 1 }}
        InputProps={{
          endAdornment: customQuery && (
            <IconButton 
              size="small" 
              onClick={handleClearQuery}
              edge="end"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )
        }}
      />
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePasteExample}
          size="small"
          startIcon={<ContentPasteGoIcon />}
          sx={{ flex: 1 }}
        >
          Example
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRunQuery}
          size="small"
          disabled={isRunning}
          startIcon={isRunning ? <CircularProgress size={16} /> : <PlayArrowIcon />}
          sx={{ flex: 1 }}
        >
          {isRunning ? 'Running...' : 'Run Query'}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            setShowHelp(!showHelp);
            setShowHistory(false);
          }}
          startIcon={<HelpOutlineIcon />}
        >
          Help
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={handleSaveQuery}
          startIcon={savedQueries.some(item => item.query === customQuery) 
            ? <BookmarkIcon /> 
            : <BookmarkBorderIcon />}
          disabled={!customQuery.trim()}
        >
          Save
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            setShowHistory(!showHistory);
            setShowHelp(false);
          }}
          startIcon={<HistoryIcon />}
        >
          History
        </Button>
      </Box>
    </>
  );

  // Desktop layout
  const renderDesktopLayout = () => (
    <Box sx={{ mb: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <TextField
            inputRef={textFieldRef}
            fullWidth
            variant="outlined"
            label="Enter SQL Query"
            value={customQuery}
            onChange={(e) => {
              setCustomQuery(e.target.value);
              setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., SELECT * FROM customers WHERE total_purchases > 1000"
            multiline
            rows={3}
            error={!!validationError}
            helperText={validationError}
            InputProps={{
              endAdornment: customQuery && (
                <IconButton 
                  size="small" 
                  onClick={handleClearQuery}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Tooltip title="Run Query (Ctrl+Enter)">
              <Button
                variant="contained"
                color="primary"
                onClick={handleRunQuery}
                disabled={isRunning}
                sx={{ height: '56px', width: '130px' }}
                startIcon={isRunning ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              >
                {isRunning ? 'Running...' : 'Run Query'}
              </Button>
            </Tooltip>
            <Tooltip title="Paste Example Query">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handlePasteExample}
                sx={{ height: '40px' }}
                startIcon={<ContentPasteGoIcon />}
              >
                Example
              </Button>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              size="small"
              variant="text"
              color="info"
              onClick={() => {
                setShowHelp(!showHelp);
                setShowHistory(false);
              }}
              startIcon={<HelpOutlineIcon />}
            >
              SQL Help
            </Button>
            <Button
              size="small"
              variant="text"
              color="info"
              onClick={() => {
                setShowHistory(!showHistory);
                setShowHelp(false);
              }}
              startIcon={<HistoryIcon />}
            >
              Query History
            </Button>
          </Box>
          
          <Tooltip title="Save Current Query">
            <span>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={handleSaveQuery}
                disabled={!customQuery.trim()}
                startIcon={savedQueries.some(item => item.query === customQuery) 
                  ? <BookmarkIcon /> 
                  : <BookmarkBorderIcon />}
              >
                Save Query
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      
      {renderHelpContent()}
      {renderQueryHistoryPanel()}
      
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default CustomQueryInput;