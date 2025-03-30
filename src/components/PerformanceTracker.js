import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  Collapse,
  IconButton,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function AdvancedPerformanceTracker({ queryData }) {
  const [loadTime, setLoadTime] = useState(0);
  const [renderMetrics, setRenderMetrics] = useState({
    renderTime: 0,
    startTime: 0,
    endTime: 0
  });
  const [dataSize, setDataSize] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (queryData && queryData.data) {
      // Always calculate a local processing time, even if queryData.executionTime exists
      const startTime = performance.now();
      
      // Process the data
      const processingSteps = [
        () => JSON.parse(JSON.stringify(queryData.data)),
        () => queryData.data.map(item => ({ ...item })),
        () => queryData.data.filter(Boolean)
      ];
      processingSteps.forEach(step => step());
      
      const endTime = performance.now();
      const processingTime = Math.round(endTime - startTime);
      
      // If no execution time is provided, use the processing time as a fallback
      const reportedExecutionTime = queryData.executionTime || 0;
      setLoadTime(reportedExecutionTime > 0 ? reportedExecutionTime : processingTime);

      // Data size calculation
      const dataString = JSON.stringify(queryData.data);
      setDataSize(dataString.length);

      // Estimated memory usage (rough approximation)
      const estimatedMemory = dataString.length / 1024; // in KB
      setMemoryUsage(estimatedMemory);

      // Render time tracking
      const renderStartTime = performance.now();
      setTimeout(() => {
        const renderEndTime = performance.now();
        setRenderMetrics({
          renderTime: Math.round(renderEndTime - renderStartTime),
          startTime: renderStartTime,
          endTime: renderEndTime
        });
      }, 0);
    }
  }, [queryData]);

  const performanceInsights = useMemo(() => {
    if (!queryData) return [];

    const insights = [];
    
    if (loadTime > 150) {
      insights.push({
        severity: 'warning',
        message: 'Query execution time is higher than optimal',
        recommendation: 'Consider optimizing your query or adding indexes'
      });
    }

    if (dataSize > 100000) {
      insights.push({
        severity: 'warning',
        message: 'Large data payload detected',
        recommendation: 'Consider pagination or filtering to reduce data volume'
      });
    }

    if (renderMetrics.renderTime > 100) {
      insights.push({
        severity: 'warning',
        message: `Render time is slow (${renderMetrics.renderTime}ms)`,
        recommendation: 'Consider using virtualization for large datasets'
      });
    }

    return insights;
  }, [loadTime, dataSize, renderMetrics, queryData]);

  const getLoadTimeColor = (time) => {
    if (time < 100) return 'success';
    if (time < 300) return 'warning';
    return 'error';
  };

  // Function to format bytes into KB, MB
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (!queryData) return null;

  return (
    <Card 
      elevation={3}
      sx={{ 
        mt: 2, 
        borderRadius: 2,
        backgroundImage: isDarkMode ? 
          `linear-gradient(${alpha(theme.palette.primary.dark, 0.05)}, ${alpha(theme.palette.background.paper, 1)})` : 
          'none',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QueryStatsIcon 
              sx={{ 
                mr: 1.5, 
                color: theme.palette.primary.main,
                fontSize: 28
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Performance Analysis
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setExpanded(!expanded)} 
            aria-label="Toggle performance details"
            sx={{ 
              bgcolor: expanded ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2)
              }
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 2, 
            borderRadius: 1, 
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <AccessTimeFilledIcon color={getLoadTimeColor(loadTime)} />
            <Tooltip title="Time taken to execute the query">
              <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, minWidth: 160 }}>
                Query Execution:
              </Typography>
            </Tooltip>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((loadTime / 500) * 100, 100)} 
              sx={{ 
                flexGrow: 1,
                height: 10,
                borderRadius: 5,
                backgroundColor: alpha(theme.palette.divider, 0.2)
              }} 
              color={getLoadTimeColor(loadTime)}
            />
            <Typography 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.getContrastText(theme.palette.background.paper),
                bgcolor: theme.palette[getLoadTimeColor(loadTime)].main,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                minWidth: 70,
                textAlign: 'center'
              }}
            >
              {loadTime} ms
            </Typography>
          </Box>
        </Paper>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  height: '100%',
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                  <ShowChartIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                  Performance Metrics
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SpeedIcon color="info" />
                  <Tooltip title="Time taken to render the results">
                    <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, minWidth: 120 }}>
                      Render Time:
                    </Typography>
                  </Tooltip>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((renderMetrics.renderTime / 200) * 100, 100)} 
                    sx={{ 
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.divider, 0.2)
                    }} 
                    color={renderMetrics.renderTime > 100 ? 'warning' : 'info'}
                  />
                  <Typography sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    {renderMetrics.renderTime} ms
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <MemoryIcon color="secondary" />
                  <Tooltip title="Estimated memory consumption">
                    <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, minWidth: 120 }}>
                      Memory Usage:
                    </Typography>
                  </Tooltip>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((memoryUsage / 100) * 100, 100)} 
                    sx={{ 
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.divider, 0.2)
                    }} 
                    color="secondary" 
                  />
                  <Typography sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    {memoryUsage.toFixed(2)} KB
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  height: '100%',
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                  <StorageIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                  Data Statistics
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Data Size
                    </Typography>
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                      {formatBytes(dataSize)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Row Count
                    </Typography>
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                      {queryData.data.length.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Avg. Row Size
                    </Typography>
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                      {queryData.data.length ? formatBytes(dataSize / queryData.data.length) : '0 B'}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Display query text with guaranteed readability in dark mode */}
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Query Preview
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 1.5, 
                      maxHeight: 80, 
                      overflow: 'auto',
                      backgroundColor: isDarkMode ? alpha(theme.palette.background.default, 0.7) : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      color: theme.palette.text.primary,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        whiteSpace: 'pre-wrap',
                        color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
                      }}
                    >
                      {queryData.query ? (queryData.query.length > 120 ? 
                        queryData.query.substring(0, 120) + '...' : 
                        queryData.query) : 'No query available'}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {performanceInsights.length > 0 && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mt: 2, 
                borderRadius: 1,
                bgcolor: alpha(theme.palette.warning.light, isDarkMode ? 0.15 : 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" color={theme.palette.warning.main} sx={{ fontWeight: 600 }}>
                  Performance Insights
                </Typography>
              </Box>
              
              {performanceInsights.map((insight, index) => (
                <Box key={index} sx={{ mt: 1, pl: 4 }}>
                  <Typography 
                    variant="body2" 
                    color={
                      insight.severity === 'warning' 
                        ? theme.palette.warning.main
                        : theme.palette.text.secondary
                    }
                    sx={{ fontWeight: 500 }}
                  >
                    • {insight.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={theme.palette.text.secondary} 
                    sx={{ pl: 2, display: 'block' }}
                  >
                    Recommendation: {insight.recommendation}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default AdvancedPerformanceTracker;