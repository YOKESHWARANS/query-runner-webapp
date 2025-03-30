import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from '../hooks/useThemeContext';
import { darkTheme, lightTheme } from './ThemeConfig';

export const ThemeProvider = ({ children }) => {
  const { darkMode } = useThemeContext();
  
  return (
    <MUIThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};