import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import ThemeToggle from '../theme/ThemeToggle';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}
        >
          {isMobile ? 'SQL Visualizer' : 'SQL Query Visualizer'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;