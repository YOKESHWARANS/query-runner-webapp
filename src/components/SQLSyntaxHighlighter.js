import React from 'react';
import { Typography } from '@mui/material';

const SQLSyntaxHighlighter = ({ query }) => {
  // SQL keywords to highlight
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'AND', 'OR', 'NOT'
  ];

  // Highlight function
  const highlightQuery = (query) => {
    let highlightedQuery = query;

    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedQuery = highlightedQuery.replace(
        regex, 
        `<span style="color: #007bff; font-weight: bold;">${keyword}</span>`
      );
    });

    // Highlight strings
    highlightedQuery = highlightedQuery.replace(
      /('([^']*)')/g, 
      '<span style="color: #28a745;">$1</span>'
    );

    // Highlight numbers
    highlightedQuery = highlightedQuery.replace(
      /\b(\d+)\b/g, 
      '<span style="color: #dc3545;">$1</span>'
    );

    return highlightedQuery;
  };

  return (
    <Typography 
      component="pre" 
      sx={{ 
        backgroundColor: '#f4f4f4', 
        padding: 2, 
        borderRadius: 2, 
        overflowX: 'auto',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}
      dangerouslySetInnerHTML={{ 
        __html: highlightQuery(query) 
      }}
    />
  );
};

export default SQLSyntaxHighlighter;