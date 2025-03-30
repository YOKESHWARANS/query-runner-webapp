import React, { useMemo } from 'react';

// Moved keywords outside the component to prevent unnecessary re-renders
const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'AND', 'OR', 'NOT',
  'HAVING', 'UNION', 'ALL', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
  'ALTER', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'DISTINCT', 'AS',
  'ON', 'BETWEEN', 'IN', 'IS', 'NULL', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'
];

const SQLSyntaxHighlighter = ({ query }) => {
  // Use useMemo to prevent unnecessary re-rendering
  const highlightedContent = useMemo(() => {
    if (!query || typeof query !== 'string') {
      return '';
    }

    let result = query;

    // Highlight keywords with word boundary check
    KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      result = result.replace(
        regex, 
        match => `<span class="keyword">${match}</span>`
      );
    });

    // Highlight strings (both single and double quotes)
    result = result.replace(
      /('([^']*)'|"([^"]*)")/g, 
      match => `<span class="string">${match}</span>`
    );

    // Highlight numbers
    result = result.replace(
      /\b(\d+)\b/g, 
      match => `<span class="number">${match}</span>`
    );

    // Highlight comments
    result = result.replace(
      /(--.*$|\/\*[\s\S]*?\*\/)/gm,
      match => `<span class="comment">${match}</span>`
    );

    // Highlight functions
    result = result.replace(
      /\b(\w+)\(/g,
      match => `<span class="function">${match}</span>`
    );

    return result;
  }, [query]);

  // Default message when no query is provided
  const displayContent = query ? highlightedContent : 'Enter SQL query to highlight';

  return (
    <div className="sql-highlighter-container">
      <pre 
        className="sql-code" 
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
      <style jsx>{`
        .sql-highlighter-container {
          position: relative;
          width: 100%;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .sql-code {
          background-color: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          padding: 1rem;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-x: auto;
          min-height: 3rem;
        }
        :global(.keyword) {
          color: #569cd6;
          font-weight: bold;
        }
        :global(.string) {
          color: #ce9178;
        }
        :global(.number) {
          color: #b5cea8;
        }
        :global(.comment) {
          color: #6a9955;
          font-style: italic;
        }
        :global(.function) {
          color: #dcdcaa;
        }
        @media (prefers-color-scheme: light) {
          .sql-code {
            background-color: #f5f5f5;
            color: #333;
          }
          :global(.keyword) {
            color: #0000ff;
          }
          :global(.string) {
            color: #a31515;
          }
          :global(.number) {
            color: #098658;
          }
          :global(.comment) {
            color: #008000;
          }
          :global(.function) {
            color: #795e26;
          }
        }
      `}</style>
    </div>
  );
};

// Set default props
SQLSyntaxHighlighter.defaultProps = {
  query: ''
};

export default SQLSyntaxHighlighter;
