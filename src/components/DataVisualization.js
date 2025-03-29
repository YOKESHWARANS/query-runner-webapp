import React, { useMemo, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Box, 
  Typography, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';

function EnhancedDataVisualization({ queryData }) {
  const [chartType, setChartType] = useState('bar');
  const [isStacked, setIsStacked] = useState(false);
  const [dataLimit, setDataLimit] = useState(5);

  // Memoize chart data generation
  const chartData = useMemo(() => {
    if (!queryData || !queryData.data || queryData.data.length === 0) {
      return [];
    }

    const data = queryData.data.slice(0, dataLimit);
    const columns = Object.keys(data[0]);

    // Prepare chart data
    return data.map(item => {
      const chartItem = { name: item[columns[0]] };
      columns.forEach((col, index) => {
        if (index > 0 && typeof item[col] === 'number') {
          chartItem[col] = item[col];
        }
      });
      return chartItem;
    });
  }, [queryData, dataLimit]);

  // COLORS for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', 
    '#FF8042', '#8884D8', '#FF6384'
  ];

  const renderChart = () => {
    if (chartData.length === 0) return null;

    const chartProps = {
      width: '100%',
      height: 300,
      data: chartData,
    };

    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    stackId={isStacked ? "a" : undefined}
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))
              }
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]} 
                  />
                ))
              }
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        const scatterColumns = Object.keys(chartData[0])
          .filter(key => key !== 'name')
          .slice(0, 2);
        
        return (
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey={scatterColumns[0]} name={scatterColumns[0]} />
              <YAxis type="number" dataKey={scatterColumns[1]} name={scatterColumns[1]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Data Points" 
                data={chartData} 
                fill="#8884d8" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        const pieColumn = Object.keys(chartData[0])
          .find(key => key !== 'name' && typeof chartData[0][key] === 'number');
        
        if (!pieColumn) return null;

        return (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={pieColumn}
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  if (!queryData || !queryData.data || queryData.data.length === 0) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="h6">
          Advanced Data Visualization
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={(e) => setChartType(e.target.value)}
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
              <MenuItem value="scatter">Scatter Chart</MenuItem>
            </Select>
          </FormControl>
          
          {chartType === 'bar' && (
            <FormControlLabel
              control={
                <Switch
                  checked={isStacked}
                  onChange={() => setIsStacked(!isStacked)}
                />
              }
              label="Stacked"
            />
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography>Data Points:</Typography>
        <Slider
          value={dataLimit}
          onChange={(e, newValue) => setDataLimit(newValue)}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
        />
      </Box>
      
      <Box sx={{ width: '100%', height: 300 }}>
        {renderChart() || (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
          >
            Unable to generate visualization
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default EnhancedDataVisualization;