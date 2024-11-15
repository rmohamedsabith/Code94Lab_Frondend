import { Button } from '@mui/material'
import React from 'react'

const AddButton = ({onClick}) => {
  return (
    <Button variant="contained" onClick={onClick} className="custom-add-button">New Product</Button>
  )
}

export default AddButton