import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../hooks/useThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <IconButton 
        onClick={toggleTheme} 
        color="inherit" 
        aria-label="toggle theme"
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;