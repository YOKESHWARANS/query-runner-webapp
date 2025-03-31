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
  alpha,
  useMediaQuery
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
  const [renderMetrics, setRenderMetrics] = useState({ renderTime: 0, startTime: 0, endTime: 0 });
  const [dataSize, setDataSize] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  // Process query data and calculate metrics
  useEffect(() => {
    if (queryData?.data) {
      const startTime = performance.now();
      
      // Process the data (simulating work)
      const processingSteps = [
        () => JSON.parse(JSON.stringify(queryData.data)),
        () => queryData.data.map(item => ({ ...item })),
        () => queryData.data.filter(Boolean)
      ];
      processingSteps.forEach(step => step());
      
      const endTime = performance.now();
      const processingTime = Math.round(endTime - startTime);
      
      // Use provided execution time or fallback to processing time
      setLoadTime(queryData.executionTime || processingTime);

      // Calculate data size
      const dataString = JSON.stringify(queryData.data);
      setDataSize(dataString.length);
      setMemoryUsage(dataString.length / 1024); // in KB

      // Track render time
      const renderStartTime = performance.now();
      setTimeout(() => {
        setRenderMetrics({
          renderTime: Math.round(performance.now() - renderStartTime),
          startTime: renderStartTime,
          endTime: performance.now()
        });
      }, 0);
    }
  }, [queryData]);

  // Generate performance insights based on metrics
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

  // Helper functions
  const getLoadTimeColor = (time) => {
    if (time < 100) return 'success';
    if (time < 300) return 'warning';
    return 'error';
  };

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
      <CardContent sx={{ px: isMobile ? 1.5 : 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QueryStatsIcon 
              sx={{ 
                mr: 1, 
                color: theme.palette.primary.main,
                fontSize: isMobile ? 24 : 28
              }} 
            />
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
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

        {/* Main Metric Card */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: isMobile ? 1.5 : 2, 
            mb: 2, 
            borderRadius: 1, 
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center', 
            gap: isMobile ? 1 : 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: isMobile ? 1 : 0,
              width: isMobile ? '100%' : 'auto'
            }}>
              <AccessTimeFilledIcon color={getLoadTimeColor(loadTime)} sx={{ mr: 1 }} />
              <Tooltip title="Time taken to execute the query">
                <Typography sx={{ 
                  fontWeight: 500, 
                  color: theme.palette.text.primary, 
                  minWidth: isMobile ? 'auto' : 160 
                }}>
                  Query Execution:
                </Typography>
              </Tooltip>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              width: isMobile ? '100%' : 'auto',
              gap: 2
            }}>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((loadTime / 500) * 100, 100)} 
                sx={{ 
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 4,
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
          </Box>
        </Paper>

        {/* Expandable Content */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={isMobile ? 1.5 : 2}>
            {/* Performance Metrics Panel */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: isMobile ? 1.5 : 2, 
                  borderRadius: 1, 
                  height: '100%',
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Typography 
                  variant={isMobile ? "body1" : "subtitle1"} 
                  sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}
                >
                  <ShowChartIcon sx={{ mr: 1, verticalAlign: 'bottom', fontSize: isMobile ? 18 : 24 }} />
                  Performance Metrics
                </Typography>
                
                {/* Render Time */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center', 
                  gap: isMobile ? 1 : 2, 
                  mb: 2 
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    width: isMobile ? '100%' : 'auto',
                    mb: isMobile ? 0.5 : 0
                  }}>
                    <SpeedIcon color="info" sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                    <Tooltip title="Time taken to render the results">
                      <Typography sx={{ 
                        fontWeight: 500, 
                        color: theme.palette.text.primary, 
                        minWidth: isMobile ? 'auto' : 120,
                        fontSize: isMobile ? '0.875rem' : 'inherit'
                      }}>
                        Render Time:
                      </Typography>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    flexGrow: 1,
                    width: isMobile ? '100%' : 'auto'
                  }}>
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
                    <Typography sx={{ 
                      fontWeight: 500, 
                      color: theme.palette.text.secondary,
                      fontSize: isMobile ? '0.875rem' : 'inherit'
                    }}>
                      {renderMetrics.renderTime} ms
                    </Typography>
                  </Box>
                </Box>

                {/* Memory Usage */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center', 
                  gap: isMobile ? 1 : 2
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    width: isMobile ? '100%' : 'auto',
                    mb: isMobile ? 0.5 : 0
                  }}>
                    <MemoryIcon color="secondary" sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                    <Tooltip title="Estimated memory consumption">
                      <Typography sx={{ 
                        fontWeight: 500, 
                        color: theme.palette.text.primary, 
                        minWidth: isMobile ? 'auto' : 120,
                        fontSize: isMobile ? '0.875rem' : 'inherit'
                      }}>
                        Memory Usage:
                      </Typography>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    flexGrow: 1,
                    width: isMobile ? '100%' : 'auto'
                  }}>
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
                    <Typography sx={{ 
                      fontWeight: 500, 
                      color: theme.palette.text.secondary,
                      fontSize: isMobile ? '0.875rem' : 'inherit'
                    }}>
                      {memoryUsage.toFixed(2)} KB
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Data Statistics Panel */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: isMobile ? 1.5 : 2, 
                  borderRadius: 1, 
                  height: '100%',
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Typography 
                  variant={isMobile ? "body1" : "subtitle1"}
                  sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}
                >
                  <StorageIcon sx={{ mr: 1, verticalAlign: 'bottom', fontSize: isMobile ? 18 : 24 }} />
                  Data Statistics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Data Size
                    </Typography>
                    <Typography 
                      variant={isMobile ? "body1" : "h6"} 
                      color="text.primary" 
                      sx={{ fontWeight: 600 }}
                    >
                      {formatBytes(dataSize)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Row Count
                    </Typography>
                    <Typography 
                      variant={isMobile ? "body1" : "h6"} 
                      color="text.primary" 
                      sx={{ fontWeight: 600 }}
                    >
                      {queryData.data.length.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Avg. Row Size
                    </Typography>
                    <Typography 
                      variant={isMobile ? "body1" : "h6"} 
                      color="text.primary" 
                      sx={{ fontWeight: 600 }}
                    >
                      {queryData.data.length ? formatBytes(dataSize / queryData.data.length) : '0 B'}
                    </Typography>
                  </Grid>
                </Grid>
                
                {/* Query Preview */}
                <Box mt={1.5}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Query Preview
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 1.5, 
                      maxHeight: isMobile ? 60 : 80, 
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
                        color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark,
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}
                    >
                      {queryData.query ? (queryData.query.length > (isMobile ? 80 : 120) ? 
                        queryData.query.substring(0, isMobile ? 80 : 120) + '...' : 
                        queryData.query) : 'No query available'}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Performance Insights */}
          {performanceInsights.length > 0 && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: isMobile ? 1.5 : 2, 
                mt: 2, 
                borderRadius: 1,
                bgcolor: alpha(theme.palette.warning.light, isDarkMode ? 0.15 : 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1 
              }}>
                <WarningAmberIcon color="warning" sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                <Typography 
                  variant={isMobile ? "body1" : "subtitle1"} 
                  color={theme.palette.warning.main} 
                  sx={{ fontWeight: 600 }}
                >
                  Performance Insights
                </Typography>
              </Box>
              
              {performanceInsights.map((insight, index) => (
                <Box key={index} sx={{ mt: 1, pl: isMobile ? 2 : 4 }}>
                  <Typography 
                    variant="body2" 
                    color={
                      insight.severity === 'warning' 
                        ? theme.palette.warning.main
                        : theme.palette.text.secondary
                    }
                    sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}
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