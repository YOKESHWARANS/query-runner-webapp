import { useState, useEffect, useCallback } from 'react';

function useQueryHistory() {
  const [queryHistory, setQueryHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('queryHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing query history:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
    } catch (error) {
      console.error('Error saving query history:', error);
    }
  }, [queryHistory]);

  // Add to history with advanced deduplication
  const addToHistory = useCallback((query) => {
    setQueryHistory(prev => {
      const cleanQuery = JSON.stringify({
        name: query.name,
        query: query.query
      });

      const exists = prev.some(q => 
        JSON.stringify({
          name: q.name,
          query: q.query
        }) === cleanQuery
      );

      if (exists) return prev;
      
      // Generate unique ID if not present
      const queryWithId = {
        ...query,
        id: query.id || `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Keep last 15 unique queries
      const updated = [...prev, queryWithId];
      return updated.slice(-15);
    });
  }, []);

  // Clear history with optional confirmation
  const clearHistory = useCallback((requireConfirmation = false) => {
    if (!requireConfirmation || window.confirm('Are you sure you want to clear query history?')) {
      setQueryHistory([]);
      localStorage.removeItem('queryHistory');
    }
  }, []);

  // Advanced search within history
  const searchHistory = useCallback((searchTerm) => {
    return queryHistory.filter(query => 
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.query.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [queryHistory]);

  return { 
    queryHistory, 
    addToHistory, 
    clearHistory,
    searchHistory 
  };
}

export default useQueryHistory;