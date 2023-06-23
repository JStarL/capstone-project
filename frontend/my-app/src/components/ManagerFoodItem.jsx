import React from 'react';
import './Components.css';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ManagerFoodItem ({ originalFoodName, originalFoodDescription }) {
  const [foodName, setFoodName] = React.useState(originalFoodName);
  const [foodDescription, setFoodDescription] = React.useState(originalFoodDescription);
  return <>
  <div className='food-item-div'>
    <div>
      <div className='food-item-img'>IMG</div>
      <Button>Edit Image</Button>
    </div>
    <div className='food-item-middle'>
      <TextField className='food-item-name' value={foodName} onChange={e => setFoodName(e.target.value)} placeholder='Food Name'></TextField>
      <TextField className='food-item-description' rows={3} multiline={true} placeholder='Description' value={foodDescription} onChange={e => setFoodDescription(e.target.value)}></TextField>
    </div>
    <div className='food-item-button'>
    <Button startIcon={<DeleteIcon/>}></Button>
      <Button>UPDATE</Button>
    </div>
  </div>
  </>
}

export default ManagerFoodItem;