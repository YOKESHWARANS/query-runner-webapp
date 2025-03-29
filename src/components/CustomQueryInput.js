import React, { useState, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Tooltip,
  Typography,
  Collapse,
  Alert
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function CustomQueryInput({ onRunCustomQuery }) {
  const [customQuery, setCustomQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const textFieldRef = useRef(null);

  const exampleQueries = [
    'SELECT customer_name, total_purchases FROM customers ORDER BY total_purchases DESC LIMIT 5',
    'SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department',
    'SELECT product_category, COUNT(*) as product_count FROM products GROUP BY product_category'
  ];

  const validateQuery = (query) => {
    if (!query.trim()) {
      return 'Query cannot be empty';
    }
    
    const restrictedKeywords = ['DROP', 'DELETE', 'TRUNCATE'];
    const upperQuery = query.toUpperCase();
    
    for (let keyword of restrictedKeywords) {
      if (upperQuery.includes(keyword)) {
        return `Potentially destructive keyword detected: ${keyword}`;
      }
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
    onRunCustomQuery({
      id: Date.now(),
      name: 'Custom Query',
      query: customQuery,
      data: generateMockData(customQuery)
    });
  };

  const handlePasteExample = () => {
    const randomQuery = exampleQueries[
      Math.floor(Math.random() * exampleQueries.length)
    ];
    setCustomQuery(randomQuery);
    textFieldRef.current?.focus();
  };

  const generateMockData = (query) => {
    const mockDataSets = {
      'customers': [
        { customer_name: 'John Doe', total_purchases: 5500 },
        { customer_name: 'Jane Smith', total_purchases: 4800 },
        { customer_name: 'Mike Johnson', total_purchases: 4200 }
      ],
      'employees': [
        { department: 'Sales', salary: 65000 },
        { department: 'Marketing', salary: 60000 },
        { department: 'Engineering', salary: 85000 }
      ],
      'products': [
        { product_category: 'Electronics', product_count: 45 },
        { product_category: 'Clothing', product_count: 30 },
        { product_category: 'Books', product_count: 25 }
      ]
    };

    for (let key in mockDataSets) {
      if (query.toLowerCase().includes(key)) {
        return mockDataSets[key];
      }
    }

    return [{ message: 'No matching mock data found' }];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          inputRef={textFieldRef}
          fullWidth
          variant="outlined"
          label="Enter Custom SQL Query"
          value={customQuery}
          onChange={(e) => {
            setCustomQuery(e.target.value);
            setValidationError(null);
          }}
          placeholder="e.g., SELECT * FROM users WHERE active = true"
          multiline
          maxRows={4}
          error={!!validationError}
          helperText={validationError}
        />
        <Tooltip title="Paste Example Query">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePasteExample}
            sx={{ height: '56px' }}
          >
            <ContentPasteGoIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Run Custom Query">
          <Button
            variant="contained"
            color="primary"
            onClick={handleRunQuery}
            startIcon={<CodeIcon />}
            sx={{ height: '56px' }}
          >
            Run
          </Button>
        </Tooltip>
        <Tooltip title="Show Query Help">
          <Button
            variant="text"
            color="info"
            onClick={() => setShowHelp(!showHelp)}
            sx={{ height: '56px' }}
          >
            <HelpOutlineIcon />
          </Button>
        </Tooltip>
      </Box>

      <Collapse in={showHelp}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            💡 Query Tips:
            • Use SELECT to retrieve data
            • Use WHERE for filtering
            • Use ORDER BY to sort results
            • Use GROUP BY for aggregations
          </Typography>
        </Alert>
      </Collapse>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Pro Tip: Click "Paste Example" for quick query templates
      </Typography>
    </Box>
  );
}

export default CustomQueryInput;