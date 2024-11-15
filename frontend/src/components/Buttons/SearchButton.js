import React from 'react';
import Button from '@mui/material/Button';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

const SearchButton = ({handleSearch}) => {
  return (
    <Button variant="contained" onClick={handleSearch}>
      <div className='search'>
        <SearchSharpIcon/> Search
      </div>
    </Button>
  );
}

export default SearchButton;
