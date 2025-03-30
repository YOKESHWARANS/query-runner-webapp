import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
  Cell,
  AreaChart,
  Area,
  Brush,
  ReferenceLine
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
  FormControlLabel,
  ButtonGroup,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip as MuiTooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Collapse,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import DownloadIcon from '@mui/icons-material/Download';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';

function EnhancedDataVisualization({ queryData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  const [chartType, setChartType] = useState('bar');
  const [isStacked, setIsStacked] = useState(false);
  const [dataLimit, setDataLimit] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showGridlines, setShowGridlines] = useState(true);
  const [smoothCurves, setSmoothCurves] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [colorMode, setColorMode] = useState('default');

  // Color palettes
  const COLOR_PALETTES = {
    default: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384'],
    pastel: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#eac4d5'],
    monochrome: ['#225588', '#336699', '#4477aa', '#5588bb', '#6699cc', '#77aadd'],
    rainbow: ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#0099ff', '#6633ff'],
    corporate: ['#0073b7', '#3c8dbc', '#00a65a', '#00c0ef', '#f39c12', '#dd4b39']
  };
  
  const COLORS = COLOR_PALETTES[colorMode];

  // Effect to simulate data loading
  useEffect(() => {
    if (queryData && queryData.data && queryData.data.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [queryData]);

  // Reset selected metric when query data changes
  useEffect(() => {
    setSelectedMetric(null);
  }, [queryData]);

  // Calculate statistics for the data
  const dataStats = useMemo(() => {
    if (!queryData || !queryData.data || queryData.data.length === 0) {
      return null;
    }

    const stats = {};
    const numericColumns = Object.keys(queryData.data[0]).filter(key => {
      return typeof queryData.data[0][key] === 'number';
    });

    numericColumns.forEach(column => {
      const values = queryData.data.map(item => item[column]);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      const sortedValues = [...values].sort((a, b) => a - b);
      const median = sortedValues[Math.floor(sortedValues.length / 2)];
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      stats[column] = {
        sum,
        mean: parseFloat(mean.toFixed(2)),
        median,
        min,
        max,
        range: max - min
      };
    });

    return stats;
  }, [queryData]);

  // Memoize chart data generation with more flexible processing
  const chartData = useMemo(() => {
    if (!queryData || !queryData.data || queryData.data.length === 0) {
      return [];
    }

    const data = [...queryData.data].slice(0, dataLimit);
    const columns = Object.keys(data[0]);
    
    // Find the name column (typically the first non-numeric column)
    const nameKey = columns.find(col => typeof data[0][col] !== 'number') || columns[0];
    
    // Get numeric columns
    const numericColumns = columns.filter(col => typeof data[0][col] === 'number');
    
    if (numericColumns.length === 0) {
      return [];
    }
    
    // If a specific metric is selected, only use that one
    const metricsToUse = selectedMetric ? [selectedMetric] : numericColumns;
    
    // Prepare chart data
    return data.map(item => {
      const chartItem = { name: item[nameKey] };
      metricsToUse.forEach(col => {
        chartItem[col] = item[col];
      });
      return chartItem;
    });
  }, [queryData, dataLimit, selectedMetric]);

  // Check if there are at least two numeric columns for scatter chart
  const hasScatterPairs = useMemo(() => {
    if (!chartData || chartData.length === 0) return false;
    const numericKeys = Object.keys(chartData[0]).filter(
      key => key !== 'name' && typeof chartData[0][key] === 'number'
    );
    return numericKeys.length >= 2;
  }, [chartData]);

  // Mock function to export chart data
  const handleExportChart = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowSnackbar(true);
      setSnackbarMessage('Chart exported successfully!');
      setSnackbarSeverity('success');
    }, 800);
    
    // In a real implementation, you would:
    // 1. Generate an image of the chart using html2canvas or similar
    // 2. Or format the data as CSV/Excel and download it
  }, []);

  // Function to reset chart options
  const handleResetChartOptions = useCallback(() => {
    setChartType('bar');
    setIsStacked(false);
    setDataLimit(5);
    setSelectedMetric(null);
    setShowGridlines(true);
    setSmoothCurves(false);
    setAnimationDuration(1000);
    setColorMode('default');
    
    setShowSnackbar(true);
    setSnackbarMessage('Chart options reset to defaults');
    setSnackbarSeverity('info');
  }, []);

  const renderChartTypeSelector = () => {
    if (isMobile) {
      return (
        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}
          >
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="line">Line Chart</MenuItem>
            {hasScatterPairs && <MenuItem value="scatter">Scatter Plot</MenuItem>}
            <MenuItem value="pie">Pie Chart</MenuItem>
            <MenuItem value="area">Area Chart</MenuItem>
          </Select>
        </FormControl>
      );
    }
    
    return (
      <ButtonGroup 
        variant="outlined" 
        size="small" 
        aria-label="chart type selection"
        sx={{ mb: 2 }}
      >
        <MuiTooltip title="Bar Chart">
          <Button 
            onClick={() => setChartType('bar')}
            variant={chartType === 'bar' ? 'contained' : 'outlined'}
            startIcon={<BarChartIcon />}
          >
            Bar
          </Button>
        </MuiTooltip>
        <MuiTooltip title="Line Chart">
          <Button 
            onClick={() => setChartType('line')}
            variant={chartType === 'line' ? 'contained' : 'outlined'}
            startIcon={<TimelineIcon />}
          >
            Line
          </Button>
        </MuiTooltip>
        {hasScatterPairs && (
          <MuiTooltip title="Scatter Plot">
            <Button 
              onClick={() => setChartType('scatter')}
              variant={chartType === 'scatter' ? 'contained' : 'outlined'}
              startIcon={<BubbleChartIcon />}
            >
              Scatter
            </Button>
          </MuiTooltip>
        )}
        <MuiTooltip title="Pie Chart">
          <Button 
            onClick={() => setChartType('pie')}
            variant={chartType === 'pie' ? 'contained' : 'outlined'}
            startIcon={<PieChartIcon />}
          >
            Pie
          </Button>
        </MuiTooltip>
        <MuiTooltip title="Area Chart">
          <Button 
            onClick={() => setChartType('area')}
            variant={chartType === 'area' ? 'contained' : 'outlined'}
            startIcon={<StackedBarChartIcon />}
          >
            Area
          </Button>
        </MuiTooltip>
      </ButtonGroup>
    );
  };

  const renderChart = () => {
    if (chartData.length === 0 || isLoading) return null;

    const chartProps = {
      width: '100%',
      height: isFullscreen ? 500 : 300,
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
      animationDuration: animationDuration
    };

    const numericColumns = Object.keys(chartData[0])
      .filter(key => key !== 'name');

    // If no numeric columns, don't render anything
    if (numericColumns.length === 0) return null;

    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer>
            <BarChart {...chartProps}>
              {showGridlines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(value) => `${value}`}
              />
              <Legend />
              {numericColumns.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  name={key}
                  stackId={isStacked ? "a" : undefined}
                  fill={COLORS[index % COLORS.length]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
              {dataLimit > 10 && <Brush dataKey="name" height={30} stroke="#8884d8" />}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer>
            <LineChart {...chartProps}>
              {showGridlines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.map((key, index) => (
                <Line 
                  key={key} 
                  type={smoothCurves ? "monotone" : "linear"}
                  dataKey={key} 
                  name={key}
                  stroke={COLORS[index % COLORS.length]} 
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
              {dataLimit > 10 && <Brush dataKey="name" height={30} stroke="#8884d8" />}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer>
            <AreaChart {...chartProps}>
              {showGridlines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.map((key, index) => (
                <Area 
                  key={key} 
                  type={smoothCurves ? "monotone" : "linear"}
                  dataKey={key} 
                  name={key}
                  stroke={COLORS[index % COLORS.length]} 
                  fill={COLORS[index % COLORS.length]} 
                  fillOpacity={0.3}
                  stackId={isStacked ? "1" : undefined}
                />
              ))}
              {dataLimit > 10 && <Brush dataKey="name" height={30} stroke="#8884d8" />}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        if (numericColumns.length < 2) return null;
        
        const xAxis = numericColumns[0];
        const yAxis = numericColumns[1];
        
        // Calculate average values for reference lines
        const xValues = chartData.map(item => item[xAxis]);
        const yValues = chartData.map(item => item[yAxis]);
        const xAvg = xValues.reduce((a, b) => a + b, 0) / xValues.length;
        const yAvg = yValues.reduce((a, b) => a + b, 0) / yValues.length;
        
        return (
          <ResponsiveContainer>
            <ScatterChart {...chartProps}>
              {showGridlines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis type="number" dataKey={xAxis} name={xAxis} />
              <YAxis type="number" dataKey={yAxis} name={yAxis} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <ReferenceLine x={xAvg} stroke="#666" strokeDasharray="3 3" />
              <ReferenceLine y={yAvg} stroke="#666" strokeDasharray="3 3" />
              <Scatter 
                name={`${xAxis} vs ${yAxis}`} 
                data={chartData} 
                fill={COLORS[0]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        if (numericColumns.length === 0) return null;
        
        const pieColumn = numericColumns[0];
        
        // Filter out zero or negative values for pie chart
        const filteredPieData = chartData.filter(item => item[pieColumn] > 0);
        
        if (filteredPieData.length === 0) return null;

        return (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={filteredPieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={isFullscreen ? 150 : 80}
                innerRadius={isFullscreen ? 60 : 30}
                fill="#8884d8"
                dataKey={pieColumn}
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {filteredPieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, pieColumn]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const renderDataStats = () => {
    if (!dataStats || !selectedMetric || !dataStats[selectedMetric]) return null;
    
    const stats = dataStats[selectedMetric];
    
    return (
      <Collapse in={showStats}>
        <Paper elevation={1} sx={{ p: 2, mb: 2, mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Statistics for {selectedMetric}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary">Min</Typography>
                  <Typography variant="body1">{stats.min}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary">Max</Typography>
                  <Typography variant="body1">{stats.max}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary">Mean</Typography>
                  <Typography variant="body1">{stats.mean}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary">Median</Typography>
                  <Typography variant="body1">{stats.median}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary">Sum</Typography>
                  <Typography variant="body1">{stats.sum}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary">Range</Typography>
                  <Typography variant="body1">{stats.range}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>
    );
  };

  const renderAdvancedOptions = () => {
    return (
      <Collapse in={showAdvancedOptions}>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Advanced Chart Options
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Color Palette</InputLabel>
                <Select
                  value={colorMode}
                  label="Color Palette"
                  onChange={(e) => setColorMode(e.target.value)}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="pastel">Pastel</MenuItem>
                  <MenuItem value="monochrome">Monochrome</MenuItem>
                  <MenuItem value="rainbow">Rainbow</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Focus Metric</InputLabel>
                <Select
                  value={selectedMetric || ''}
                  label="Focus Metric"
                  onChange={(e) => setSelectedMetric(e.target.value || null)}
                >
                  <MenuItem value="">All Metrics</MenuItem>
                  {chartData.length > 0 && Object.keys(chartData[0])
                    .filter(key => key !== 'name')
                    .map(key => (
                      <MenuItem key={key} value={key}>{key}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showGridlines}
                    onChange={() => setShowGridlines(!showGridlines)}
                    size="small"
                  />
                }
                label="Show Gridlines"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={smoothCurves}
                    onChange={() => setSmoothCurves(!smoothCurves)}
                    size="small"
                    disabled={!['line', 'area'].includes(chartType)}
                  />
                }
                label="Smooth Curves"
              />
            </Grid>
            
            {(chartType === 'bar' || chartType === 'area') && (
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isStacked}
                      onChange={() => setIsStacked(!isStacked)}
                      size="small"
                    />
                  }
                  label="Stacked View"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="caption" gutterBottom>
                Animation Duration: {animationDuration}ms
              </Typography>
              <Slider
                value={animationDuration}
                onChange={(e, newValue) => setAnimationDuration(newValue)}
                min={0}
                max={2000}
                step={100}
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>
    );
  };

  if (!queryData || !queryData.data || queryData.data.length === 0) {
    return null;
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mt: 2,
        height: isFullscreen ? '100vh' : 'auto',
        width: isFullscreen ? '100vw' : 'auto',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1300 : 1,
        overflowY: 'auto'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          width: isMobile ? '100%' : 'auto',
          mb: isMobile ? 1 : 0
        }}>
          <Typography variant="h6">
            Data Visualization
          </Typography>
          <Chip 
            size="small" 
            label={`${queryData.data.length} rows`}
            color="primary"
            variant="outlined"
          />
          {queryData.executionTime && (
            <Chip 
              size="small" 
              label={`${queryData.executionTime}ms`}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'space-between' : 'flex-start'
        }}>
          <MuiTooltip title="Export Chart">
            <IconButton size="small" onClick={handleExportChart}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </MuiTooltip>
          
          <MuiTooltip title={showAdvancedOptions ? "Hide Options" : "Show Options"}>
            <IconButton 
              size="small" 
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              color={showAdvancedOptions ? "primary" : "default"}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          </MuiTooltip>
          
          <MuiTooltip title={showStats ? "Hide Stats" : "Show Stats"}>
            <span>
              <IconButton 
                size="small" 
                onClick={() => setShowStats(!showStats)}
                color={showStats ? "primary" : "default"}
                disabled={!selectedMetric}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </MuiTooltip>
          
          <MuiTooltip title="Reset Options">
            <IconButton size="small" onClick={handleResetChartOptions}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </MuiTooltip>
          
          <MuiTooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton size="small" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </MuiTooltip>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {renderChartTypeSelector()}
      
      {renderAdvancedOptions()}
      
      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 2,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Typography variant={isMobile ? 'caption' : 'body2'}>
          Data Points:
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Slider
            value={dataLimit}
            onChange={(e, newValue) => setDataLimit(newValue)}
            valueLabelDisplay="auto"
            step={1}
            marks={!isMobile}
            min={1}
            max={Math.min(15, queryData.data.length)}
          />
        </Box>
      </Box>
      
      {renderDataStats()}
      
      <Box sx={{ 
        width: '100%', 
        height: isFullscreen ? 500 : 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {isLoading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Generating visualization...
            </Typography>
          </Box>
        ) : renderChart() || (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
          >
            Unable to generate visualization. No numeric data available.
          </Typography>
        )}
      </Box>
      
      {!isMobile && !isMedium && queryData.name && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 2, display: 'block' }}
        >
          Source: {queryData.name} {queryData.query && `• ${queryData.query.substring(0, 60)}${queryData.query.length > 60 ? '...' : ''}`}
        </Typography>
      )}
      
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default EnhancedDataVisualization;