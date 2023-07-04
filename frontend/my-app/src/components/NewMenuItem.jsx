import React from 'react';
import '../App.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Input, Typography, Paper } from '@mui/material';
import { fileToDataUrl } from './helperFunctions'
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import makeRequest from '../makeRequest';
import { StyledButton } from '../pages/CustomerOrStaff';

function NewMenuItem(props) {
  const [foodName, setFoodName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [ingredients, setIngredients] = React.useState('')
  const [price, setPrice] = React.useState(0)
  const [image, setImage] = React.useState('');
  const [imageName, setImageName] = React.useState('')

  const params = useParams();
  const navigate = useNavigate();
  const manager_id = localStorage.getItem('staff_id')
  const category_id = params.categoryId
  const menu_id = params.menuId

  console.log(menu_id)
  console.log(category_id)

  function addMenuItem() {
    const body = JSON.stringify({
      'manager_id': manager_id,
      'menu_id': menu_id,
      'category_id': category_id,
      'title': foodName,
      'image': image !== null ? image : undefined,
      price,
      'ingredients': ingredients,
      'description': description !== null ? description : undefined,
    });

    makeRequest('/manager/add_menu_item', 'POST', body, undefined)
      .then(data => {
        console.log(data)
        navigate(`/manager/menu/${menu_id}`)
      })
      .catch(e => console.log('Error: ' + e));
  }

  // image

  async function handleFileSelect(event) {
    setImageName(event.target.files[0].name)
    const thumbnailUrl = await fileToDataUrl(event.target.files[0])
    setImage(thumbnailUrl);
  }
  return <>
    <div className='login-page'>
      <Paper sx={{ p: 4, borderRadius: '20px', width: '50%' }} elevation={5}>
        <form className='login-form'>
          <Typography className='h4' variant="h4" gutterBottom>Add new menu item to <b>{props.categoryName}</b></Typography>
          <TextField sx={{ mb: 2 }} className='long input' label='Food Name' variant='outlined' value={foodName} onChange={e => setFoodName(e.target.value)}></TextField>
          <TextField sx={{ mb: 2 }} className='long input' label='Description' variant='outlined' rows={3} multiline={true} value={description} onChange={e => setDescription(e.target.value)}></TextField>
          <FormControl className='long input'>
            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
            <OutlinedInput
              sx={{ mb: 2 }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              type='number'
            />
          </FormControl>
          <TextField sx={{ mb: 2 }} className='long input' id='outlined-basic' label='Ingredients' variant='outlined' rows={3} multiline={true} value={ingredients} onChange={e => setIngredients(e.target.value)}></TextField>
          {image
            ? <div className='image'><img style={{ height: '300px', width: '300px' }} src={image}></img></div>
            : <div></div>}
          <div><Typography variant='overline' sx={{ fontSize: '10px' }}>{imageName}</Typography></div>
          <div>
            <label htmlFor="upload-photo">
              <StyledButton sx={{ mb: 2 }} variant='outlined' aria-label="upload picture" component="label">Add Image
                <Input style={{ display: 'none' }} accept='image/png, image/jpeg'
                  type="file"
                  onChange={handleFileSelect}
                />
              </StyledButton>
              {/* <div><Typography variant='overline' sx={{ fontSize: '10px' }}>{imageName}</Typography></div> */}
            </label></div>
          <StyledButton sx={{ mb: 2 }} variant='outlined' onClick={addMenuItem}>ADD TO MENU</StyledButton>
        </form>
      </Paper>
    </div>
  </>
}

export default NewMenuItem;