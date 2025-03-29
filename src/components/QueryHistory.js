import React, { useState, useEffect } from 'react';
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
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function QueryHistory({ queryHistory = [], onSelectQuery, onClearHistory, onFavoriteQuery, favoritedQueries = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Filter based on search term
    const filtered = queryHistory.filter(query => 
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.query.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredHistory(filtered);
  }, [searchTerm, queryHistory]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, mb: 2 }}>
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
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} />
          Query History
          <Badge 
            badgeContent={queryHistory.length} 
            color="primary" 
            sx={{ ml: 2 }}
          />
        </Typography>
        <Chip 
          label={isExpanded ? "Hide History" : "Show History"} 
          size="small" 
          color={isExpanded ? "primary" : "default"}
        />
      </Box>

      <Collapse in={isExpanded}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />

        <Divider sx={{ my: 1 }} />

        {filteredHistory.length > 0 ? (
          <List dense>
            {filteredHistory.map((query, index) => (
              <ListItem 
                key={index} 
                button 
                onClick={() => onSelectQuery(query)}
                divider={index < filteredHistory.length - 1}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {query.name}
                      {query.executionTime && (
                        <Tooltip title="Query execution time">
                          <Chip 
                            size="small" 
                            label={`${query.executionTime}ms`} 
                            color="default" 
                            variant="outlined"
                            icon={<AccessTimeIcon fontSize="small" />}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {truncateQuery(query.query)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {query.timestamp && formatTimestamp(query.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Run this query">
                    <IconButton 
                      edge="end" 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectQuery(query);
                      }}
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
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            {searchTerm ? 'No matching queries found' : 'No query history yet'}
          </Typography>
        )}
      </Collapse>
    </Paper>
  );
}

export default QueryHistory;