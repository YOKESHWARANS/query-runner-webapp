import React, { useState, useEffect, useMemo } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Divider,
  Collapse,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Button,
  Fade,
  ListItemIcon,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import StarIcon from '@mui/icons-material/Star';

function QueryHistory({ 
  queryHistory = [], 
  onSelectQuery, 
  onClearHistory, 
  onFavoriteQuery, 
  favoritedQueries = [],
  onCopyQuery,
  loading = false
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Memoize favorite queries to avoid unnecessary filtering
  const favoriteQueries = useMemo(() => {
    return queryHistory.filter(query => 
      favoritedQueries.some(fav => fav.query === query.query)
    );
  }, [queryHistory, favoritedQueries]);

  useEffect(() => {
    // Get the appropriate source based on active tab
    const sourceQueries = activeTab === 0 ? queryHistory : favoriteQueries;
    
    // Filter based on search term
    let filtered = sourceQueries.filter(query => 
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.query.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort the results
    filtered = sortQueries(filtered, sortOrder);
    
    setFilteredHistory(filtered);
  }, [searchTerm, queryHistory, favoriteQueries, activeTab, sortOrder]);

  const sortQueries = (queries, order) => {
    return [...queries].sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      } else if (order === 'oldest') {
        return new Date(a.timestamp || 0) - new Date(b.timestamp || 0); 
      } else if (order === 'fastest') {
        return (a.executionTime || Infinity) - (b.executionTime || Infinity);
      } else if (order === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday, show "Yesterday"
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, show date and time
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isFavorited = (query) => {
    return favoritedQueries.some(fav => fav.query === query.query);
  };

  const handleToggleFavorite = (query, event) => {
    event.stopPropagation();
    onFavoriteQuery(query);
  };

  const truncateQuery = (query, maxLength = 50) => {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    handleMenuClose();
  };

  const handleClearHistory = () => {
    onClearHistory();
    handleMenuClose();
  };

  const handleCopyQuery = (query, event) => {
    event.stopPropagation();
    if (onCopyQuery) {
      onCopyQuery(query);
    } else {
      navigator.clipboard.writeText(query.query);
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 2, 
      mt: 2, 
      mb: 2,
      borderRadius: 2,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: 6
      }
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: theme.palette.primary.main
        }}>
          <HistoryIcon sx={{ mr: 1 }} />
          Query History
          <Fade in={queryHistory.length > 0}>
            <Badge 
              badgeContent={queryHistory.length} 
              color="primary" 
              sx={{ ml: 2 }}
              max={999}
            />
          </Fade>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={isExpanded ? "Hide" : "Show"} 
            size="small" 
            color={isExpanded ? "primary" : "default"}
            variant={isExpanded ? "filled" : "outlined"}
            sx={{ transition: 'all 0.2s ease' }}
          />
        </Box>
      </Box>

      <Collapse in={isExpanded} timeout={300}>
        <Box sx={{ mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab 
              icon={<HistoryIcon />} 
              label={!isMobile && "All Queries"} 
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab 
              icon={<StarIcon />} 
              label={!isMobile && "Favorites"} 
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          
          <Tooltip title="Sort & Filter">
            <IconButton onClick={handleMenuOpen} color="primary" sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
              <SortIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <SortIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Sort by</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSortChange('newest')} selected={sortOrder === 'newest'}>
              <Typography variant="body2" sx={{ pl: 4 }}>Newest first</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSortChange('oldest')} selected={sortOrder === 'oldest'}>
              <Typography variant="body2" sx={{ pl: 4 }}>Oldest first</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSortChange('fastest')} selected={sortOrder === 'fastest'}>
              <Typography variant="body2" sx={{ pl: 4 }}>Execution time</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSortChange('name')} selected={sortOrder === 'name'}>
              <Typography variant="body2" sx={{ pl: 4 }}>Name</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClearHistory}>
              <ListItemIcon>
                <ClearAllIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="body2" color="error">Clear history</Typography>
            </MenuItem>
          </Menu>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          // Loading state
          Array.from(new Array(3)).map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="40%" height={28} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="30%" height={16} />
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))
        ) : filteredHistory.length > 0 ? (
          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredHistory.map((query, index) => (
              <ListItem 
                key={index} 
                button 
                onClick={() => onSelectQuery(query)}
                divider={index < filteredHistory.length - 1}
                sx={{
                  borderRadius: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{query.name}</Typography>
                      {query.executionTime && (
                        <Tooltip title="Query execution time">
                          <Chip 
                            size="small" 
                            label={`${query.executionTime}ms`} 
                            color="default" 
                            variant="outlined"
                            icon={<AccessTimeIcon fontSize="small" />}
                            sx={{ height: 20 }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Tooltip title={query.query}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          component="span"
                          sx={{ 
                            fontFamily: 'monospace',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {truncateQuery(query.query)}
                        </Typography>
                      </Tooltip>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {query.timestamp && formatTimestamp(query.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Copy query">
                    <IconButton 
                      edge="end" 
                      size="small" 
                      onClick={(e) => handleCopyQuery(query, e)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Run this query">
                    <IconButton 
                      edge="end" 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectQuery(query);
                      }}
                      color="primary"
                    >
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isFavorited(query) ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton 
                      edge="end" 
                      size="small" 
                      onClick={(e) => handleToggleFavorite(query, e)}
                      color={isFavorited(query) ? "secondary" : "default"}
                    >
                      {isFavorited(query) ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {searchTerm ? 'No matching queries found' : 
                activeTab === 0 ? 'No query history yet' : 'No favorite queries yet'}
            </Typography>
            {activeTab === 0 && searchTerm === '' && (
              <Typography variant="caption" color="text.secondary">
                Run some queries to see your history here
              </Typography>
            )}
            {activeTab === 1 && searchTerm === '' && (
              <Typography variant="caption" color="text.secondary">
                Bookmark queries to add them to your favorites
              </Typography>
            )}
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

export default QueryHistory;