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
  IconButton
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

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

  useEffect(() => {
    if (queryData && queryData.data) {
      // Set execution time from the query if available
      if (queryData.executionTime) {
        setLoadTime(queryData.executionTime);
      } else {
        // Comprehensive performance tracking
        const startTime = performance.now();
        
        const processingSteps = [
          () => JSON.parse(JSON.stringify(queryData.data)),
          () => queryData.data.map(item => ({ ...item })),
          () => queryData.data.filter(Boolean)
        ];

        processingSteps.forEach(step => step());

        const endTime = performance.now();
        const totalLoadTime = Math.round(endTime - startTime);
        setLoadTime(totalLoadTime);
      }

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

  if (!queryData) return null;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QueryStatsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Performance Analysis
            </Typography>
          </Box>
          <IconButton onClick={() => setExpanded(!expanded)} aria-label="Toggle performance details">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <AccessTimeFilledIcon color={getLoadTimeColor(loadTime)} />
          <Tooltip title="Time taken to execute the query">
            <Typography>Query Execution Time:</Typography>
          </Tooltip>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((loadTime / 500) * 100, 100)} 
            sx={{ flexGrow: 1 }} 
            color={getLoadTimeColor(loadTime)}
          />
          <Typography>{loadTime} ms</Typography>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <SpeedIcon />
                <Tooltip title="Time taken to render the results">
                  <Typography>Render Time:</Typography>
                </Tooltip>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((renderMetrics.renderTime / 200) * 100, 100)} 
                  sx={{ flexGrow: 1 }} 
                  color={renderMetrics.renderTime > 100 ? 'warning' : 'primary'}
                />
                <Typography>{renderMetrics.renderTime} ms</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <MemoryIcon />
                <Tooltip title="Estimated memory consumption">
                  <Typography>Memory Usage:</Typography>
                </Tooltip>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((memoryUsage / 100) * 100, 100)} 
                  sx={{ flexGrow: 1 }} 
                  color="secondary" 
                />
                <Typography>{memoryUsage.toFixed(2)} KB</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Tooltip title="Size of processed data">
                  <Typography variant="body2" color="text.secondary">
                    <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Data Size: {dataSize} bytes
                  </Typography>
                </Tooltip>
                <Tooltip title="Number of rows in result">
                  <Typography variant="body2" color="text.secondary">
                    Rows: {queryData.data.length}
                  </Typography>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {performanceInsights.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="warning.main">
                Performance Insights:
              </Typography>
              {performanceInsights.map((insight, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Typography 
                    variant="body2" 
                    color={
                      insight.severity === 'warning' 
                        ? 'warning.main' 
                        : 'text.secondary'
                    }
                  >
                    • {insight.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 2, display: 'block' }}>
                    Recommendation: {insight.recommendation}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default AdvancedPerformanceTracker;