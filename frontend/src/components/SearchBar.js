import React, { useState, useEffect, useMemo, useRef } from 'react';
import SearchButton from '../components/Buttons/SearchButton';
import debounce from 'lodash.debounce';

const SearchBar = (props) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { keyword, setKeyword, allProducts, handleSearch } = props;
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Ref to track the search container to check if click is outside
  const searchContainerRef = useRef(null);

  // Memoize filtered products to prevent unnecessary recomputations
  const filteredSuggestions = useMemo(() => {
    if (keyword) {
      return allProducts.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    return [];
  }, [keyword, allProducts]);

  // Debounced function to handle suggestions
  const fetchSuggestions = debounce(() => {
    if (showSuggestions) {
      setSuggestions(filteredSuggestions);
    }
  }, 500);

  useEffect(() => {
    if (keyword) {
      setShowSuggestions(true);  // Show suggestions when typing
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);  // Close suggestions if no keyword
    }

    return () => {
      fetchSuggestions.cancel();
    };
  }, [keyword]);

  useEffect(() => {
    // Close suggestions when clicking outside the search container
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSuggestions([]);
        setShowSuggestions(false);  // Close suggestions
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      setKeyword(suggestions[highlightedIndex].name);
      setSuggestions([]);
      setShowSuggestions(false);  // Close suggestions after selection
    }
  };

  // Handle the search action (close suggestions when the button is clicked)
  const handleSearchWithClose = () => {
    handleSearch(); // Call the provided handleSearch function
    setSuggestions([]);
    setShowSuggestions(false); // Close suggestions when search is initiated
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search for products"
        onKeyDown={handleKeyDown}
      />
      <SearchButton handleSearch={handleSearchWithClose} />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown" role="listbox" aria-labelledby="searchInput">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              role="option"
              aria-selected={highlightedIndex === index}  
              onClick={() => {
                setKeyword(suggestion.name);
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}  
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
