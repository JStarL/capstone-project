import React from 'react';
import './Components.css';
import { Button, TextField, Input } from '@mui/material';
import { fileToDataUrl } from './helperFunctions';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';

function CustomerFoodItem ({ foodName, foodDescription, foodPrice }) {
  const [image, setImage] = React.useState(null)
  async function handleFileSelect (event) {
    const thumbnailUrl = await fileToDataUrl(event.target.files[0])
    setImage(thumbnailUrl);
  }

  console.log(foodName)
  return <>
  <div className='food-item-div'>
    <div>
      {image
      ? <div className='image'><img style={{ height: '200px', width: '200px', margin: '5px' }} src={image}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle'>
      <div className='div-section'><b>{foodName}</b></div>
      <div className='div-section'>{foodDescription}</div>
      <div className='div-section'>Price: $ {foodPrice}</div>
    </div>
    <div className='food-item-button'>
        <Button>Find out more</Button>
        <Button>Add to Order</Button>
    </div>
  </div>
  </>
}

export default CustomerFoodItem;