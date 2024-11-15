import React from 'react';
import alerIcon from '../assets/alert.svg'
import { Image } from 'react-bootstrap';
import { Button } from '@mui/material';

const DeleteModal = ({ showModal, handleClose, handleDelete }) => {
  if (!showModal) return null; 
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <Image src={alerIcon}/>
        <h3>You will not be able to undo this action if you proceed!</h3>
        <div className="modal-actions">
          <Button variant="outlined" onClick={handleClose} className="cancel-btn">Cancel</Button>
          <Button  variant="contained" onClick={handleDelete} className="delete-btn">Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
