import { Button } from '@mui/material'
import React from 'react'
import staredIcon from"../../assets/starred.svg";

const FavoriteButton = ({onClick}) => {
  return (
    <Button variant="outlined" className="favoriteBtn" onClick={onClick}><img src={staredIcon}/></Button>
  )
}

export default FavoriteButton