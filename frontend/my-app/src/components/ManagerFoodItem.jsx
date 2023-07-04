import React from 'react';
import './Components.css';
import { Button, TextField, Input } from '@mui/material';
import { fileToDataUrl } from './helperFunctions';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import makeRequest from '../makeRequest';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';

function ManagerFoodItem({ originalFoodName, originalFoodDescription, originalPrice, originalImage, originalIngredients, foodId, categoryId, categoryName, fetchCategoryMenuItems }) {
  const [foodName, setFoodName] = React.useState('');
  const [foodDescription, setFoodDescription] = React.useState('');
  const [ingredients, setIngredients] = React.useState('')
  const [image, setImage] = React.useState(originalImage)
  const [price, setPrice] = React.useState(originalPrice)

  React.useEffect(() => {
    console.log(originalFoodDescription)
    console.log(foodDescription)
    setFoodName(originalFoodName)
    setFoodDescription(originalFoodDescription)
    setImage(originalImage)
    setPrice(originalPrice)
    toStringForm();
  }, [originalFoodDescription, originalFoodName, originalImage, originalPrice, originalIngredients]);

  function toStringForm() {
    if (originalIngredients !== "{}") {
      setIngredients(originalIngredients)
    }
    else {
      setIngredients("")
    }
  }
  const navigate = useNavigate();
  async function handleFileSelect(event) {
    const thumbnailUrl = await fileToDataUrl(event.target.files[0])
    setImage(thumbnailUrl);
  }
  const managerId = localStorage.getItem('staff_id')
  const menuId = localStorage.getItem('menu_id')
  function updateFoodItem() {
    const body = JSON.stringify({
      'manager_id': managerId,
      'menu_item_id': foodId,
      'title': foodName,
      price,
      'ingredients': ingredients,
      'description': foodDescription,
      'category_id': categoryId,
      'menu_id': menuId,
      image
    });
    makeRequest('/manager/update_menu_item', 'POST', body, undefined)
      .then(data => {
        console.log(data)
      })
      .catch(e => console.log('Error: ' + e));
  }

  function deleteFoodItem() {
    const body = JSON.stringify({
      'manager_id': managerId,
      'menu_item_id': foodId,
    });

    makeRequest('/manager/delete_menu_item', 'DELETE', body, undefined)
      .then(data => {
        console.log(data);
        // fetchAllMenuData();
        fetchCategoryMenuItems();
      })
      .catch(e => console.log('Error: ' + e));
  }

  return <>
    <div className='food-item-div'>
      <div>
        {image ? (
          <div>
            <img style={{ width: '30vh', height: '30vh', margin: '20px', borderRadius: '10px' }} src={image} alt='Food Item' />
          </div>
        ) : (
          <div className='food-item-img'>IMG</div>
        )}
        <div>
          <label htmlFor="upload-photo">
            <StyledButton sx={{ width: '70%', m: 1 }} aria-label="upload picture" component="label">
              Edit Image
              <Input style={{ display: 'none' }} accept='image/png, image/jpeg' type="file" onChange={handleFileSelect} />
            </StyledButton>
          </label>
        </div>
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
        <div className='div-section'><TextField className='food-item-description' rows={3} multiline={true} label='Ingredients' value={ingredients} onChange={e => setIngredients(e.target.value)}></TextField></div>
      </div>
      <div className='food-item-button'>
        {categoryName !== 'Best Selling'
          ? <Button sx={{ color: '#002250' }} onClick={deleteFoodItem} startIcon={<DeleteIcon />}></Button>
          : null
        }
        <StyledButton sx={{ width: '35%' }} onClick={updateFoodItem}>UPDATE</StyledButton>
      </div>
    </div>
  </>
}

export default ManagerFoodItem;