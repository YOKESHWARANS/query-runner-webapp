import React from 'react';
import { 
  Typography, 
  Paper, 
  Box  
} from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            m: 2, 
            textAlign: 'center', 
            bgcolor: 'error.light', 
            color: 'error.contrastText' 
          }}
        >
          <Box>
            <Typography variant="h5">Something went wrong</Typography>
            <Typography variant="body1">
              An unexpected error occurred. Please try again or contact support.
            </Typography>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;