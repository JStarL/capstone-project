import React from 'react';
import '../App.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Input, Typography } from '@mui/material';
import { fileToDataUrl } from './helperFunctions'
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import makeRequest from '../makeRequest';

function NewMenuItem () {
  const [foodName, setFoodName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [ingredients, setIngredients] = React.useState([])
  const [price, setPrice] = React.useState(4)
  const [image, setImage] = React.useState(null);
  const [imageName, setImageName] = React.useState('')

  const params = useParams();
  const navigate = useNavigate();
  const manager_id = localStorage.getItem('staff_id')
  const category_id = params.categoryId
  const menu_id = params.menuId

  console.log(menu_id)

  function addMenuItem() {
    const body = JSON.stringify({
      'manager_id': manager_id,
      'menu_id': menu_id,
      'category_id': category_id,
      'title': foodName,
      price,
      ingredients,
      description,
    });

    makeRequest('/manager/add_menu_item', 'POST', body, undefined)
      .then(data => {
        console.log(data)
        navigate(`/manager/menu/${menu_id}`)
      })
      .catch(e => console.log('Error: ' + e));
  }

  // image

  async function handleFileSelect (event) {
    setImageName(event.target.files[0].name)
    const thumbnailUrl = await fileToDataUrl(event.target.files[0])
    setImage(thumbnailUrl);
  }
  return <>
  <div className='new-item-div'>
    <div className='div-section'>
        <TextField className='long input' id='outlined-basic' label='Food Name' variant='outlined' value={foodName} onChange={e => setFoodName(e.target.value)}></TextField>
    </div>
    <div className='div-section'>
        <TextField className='long input' id='outlined-basic' label='Description' variant='outlined' rows={3} multiline={true} value={description} onChange={e => setDescription(e.target.value)}></TextField>
    </div>
    <div className='div-section'>
      {/* <TextField select className='long input' label='Category' variant='outlined'>
      {categories.map((option) => (
        <MenuItem value={option.category}>
          {option.category}
        </MenuItem>
      ))}
      </TextField> */}
      </div>
        {/* <TextField className='short input' id='outlined-basic' label='Price' variant='outlined'></TextField> */}
        <div className='div-section'><FormControl className='long input'>
          <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
          <OutlinedInput
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            type='number'
          />
        </FormControl></div>
    <div className='div-section'>
        <TextField className='long input' id='outlined-basic' label='Ingredients' variant='outlined' rows={3} multiline={true} value={ingredients} onChange={e => setIngredients(e.target.value)}></TextField>
    </div>
    {image
      ? <div className='image'><img style={{ height: '300px', width: '300px' }} src={image}></img></div>
      : <div></div>}
    <div>
    <label htmlFor="upload-photo"> 
      <Button color="primary" aria-label="upload picture" component="label">Add Image
        <Input style={{ display: 'none' }} accept='image/png, image/jpeg'
          type="file"
          onChange={handleFileSelect}
        />
      </Button>
      <div><Typography variant='overline' sx={{ fontSize: '10px' }}>{imageName}</Typography></div>
    </label></div>
    <Button onClick={addMenuItem}>ADD TO MENU</Button>
  </div>
  </>
}

export default NewMenuItem;