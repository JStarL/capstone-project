import React from 'react';
import './Components.css';
import { Button, TextField, Input } from '@mui/material';
import { fileToDataUrl } from './helperFunctions';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';

function ManagerFoodItem ({ originalFoodName, originalFoodDescription }) {
  const [foodName, setFoodName] = React.useState(originalFoodName);
  const [foodDescription, setFoodDescription] = React.useState(originalFoodDescription);
  const [image, setImage] = React.useState(null)
  const [price, setPrice] = React.useState('2')
  async function handleFileSelect (event) {
    const thumbnailUrl = await fileToDataUrl(event.target.files[0])
    setImage(thumbnailUrl);
  }

  return <>
  <div className='food-item-div'>
    <div>
      {image
      ? <div className='image'><img style={{ height: '200px', width: '200px', margin: '5px' }} src={image}></img></div>
      : <div className='food-item-img'>IMG</div>}
      <div>
      <label htmlFor="upload-photo"> 
        <Button color="primary" aria-label="upload picture" component="label">Edit Image
          <Input style={{ display: 'none' }} accept='image/png, image/jpeg'
            type="file"
            onChange={handleFileSelect}
          />
        </Button>
      </label></div>
    </div>
    <div className='food-item-middle'>
      <div className='div-section'><TextField className='food-item-name' value={foodName} onChange={e => setFoodName(e.target.value)} label='Food Name'></TextField></div>
      <div className='div-section'><TextField className='food-item-description' rows={3} multiline={true} label='Description' value={foodDescription} onChange={e => setFoodDescription(e.target.value)}></TextField></div>
      <div className='div-section'><FormControl className='long input'>
        <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
        <OutlinedInput
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Price"
          onChange={e => setPrice(e.target.value)}
          value={price}
        />
      </FormControl></div>
    </div>
    <div className='food-item-button'>
    <Button startIcon={<DeleteIcon/>}></Button>
      <Button>UPDATE</Button>
    </div>
  </div>
  </>
}

export default ManagerFoodItem;