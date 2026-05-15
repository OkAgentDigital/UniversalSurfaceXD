import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: 'task' | 'document';
  updated_at: number;
}

export function SearchPanel() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const searchResults = await window.electron.search(searchQuery);
      setResults(searchResults || []);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    }
    setIsSearching(false);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setQuery('');
      setResults([]);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'document') {
      navigate(`/editor/${result.id}`);
    } else {
      // For tasks, navigate to editor if they have a document_id
      navigate(`/editor/${result.id}`);
    }
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} style={{ background: '#264f78', color: '#fff', borderRadius: 2 }}>{part}</mark> : part
    );
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-search"></i>
          <span>SEARCH</span>
        </div>
      </div>
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <i className="codicon codicon-search"></i>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks and documents..."
            className="search-input"
          />
          {query && (
            <i
              className="codicon codicon-close search-input-clear"
              onClick={() => { setQuery(''); setResults([]); }}
            ></i>
          )}
        </div>
      </div>
      <div className="sidebar-content">
        {isSearching && (
          <div className="empty-state">
            <i className="codicon codicon-loading codicon-modifier-spin"></i>
            <p>Searching...</p>
          </div>
        )}
        {!isSearching && query && results.length === 0 && (
          <div className="empty-state">
            <i className="codicon codicon-search-stop"></i>
            <p>No results found</p>
          </div>
        )}
        {!query && (
          <div className="empty-state">
            <i className="codicon codicon-search"></i>
            <p>Type to search across tasks and documents</p>
          </div>
        )}
        {results.map((result, index) => (
          <div
            key={`${result.type}-${result.id}`}
            className={`file-explorer-item ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleSelectResult(result)}
            style={{ paddingLeft: 12 }}
          >
            <i
              className={`codicon ${result.type === 'document' ? 'codicon-file' : 'codicon-checklist'}`}
            ></i>
            <div className="search-result-text">
              <div className="task-title">
                {highlightMatch(result.title, query)}
              </div>
              <div className="search-result-snippet">
                {result.snippet && highlightMatch(result.snippet.substring(0, 80), query)}
              </div>
            </div>
            <span className="task-badge">
              {result.type === 'document' ? 'doc' : 'task'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
