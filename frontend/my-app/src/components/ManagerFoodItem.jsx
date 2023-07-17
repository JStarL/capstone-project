import React from 'react';
import './Components.css';
import { Typography, Button, TextField, Input, Select } from '@mui/material';
import { fileToDataUrl } from './helperFunctions';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import makeRequest from '../makeRequest';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import IngredientAllergyPair from './IngredientAllergyPair';

function ManagerFoodItem({ allergies, originalFoodName, originalFoodDescription, originalPrice, originalImage, originalIngredients, foodId, categoryId, categoryName, fetchCategoryMenuItems }) {
  const [foodName, setFoodName] = React.useState('');
  const [foodDescription, setFoodDescription] = React.useState('');
  const [ingredientAndAllergyList, setIngredientAndAllergyList] = React.useState(originalIngredients);
  const [image, setImage] = React.useState(originalImage)
  const [price, setPrice] = React.useState(originalPrice);
  const [isListVisible, setListVisible] = React.useState(false);

  React.useEffect(() => {
    setFoodName(originalFoodName)
    setFoodDescription(originalFoodDescription)
    setImage(originalImage)
    setPrice(originalPrice)
    setIngredientAndAllergyList(originalIngredients)
  }, [originalFoodDescription, originalFoodName, originalImage, originalPrice, originalIngredients]);

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
      'ingredients': ingredientAndAllergyList,
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
        fetchCategoryMenuItems();
      })
      .catch(e => console.log('Error: ' + e));
  }

  function toggleListVisibility() {
    setListVisible(!isListVisible);
  }

  function handleDeleteIngredientAllergyPair(index) {
    const updatedList = [...ingredientAndAllergyList];
    updatedList.splice(index, 1);
    setIngredientAndAllergyList(updatedList);
  }

  return (
    <>
      {console.log(originalIngredients)}
      <div className='food-item-div'>
        <div>
          {image ? (
            <div>
              <img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={image} alt='Food Item' />
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
          <div className='div-section'>
            <TextField
              className='food-item-name'
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              label='Food Name'
            />
          </div>
          <div className='div-section'>
            <TextField
              className='food-item-description'
              rows={3}
              multiline
              label='Description'
              value={foodDescription}
              onChange={e => setFoodDescription(e.target.value)}
            />
          </div>
          <div className='div-section'>
            <FormControl className='long input'>
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Price"
                onChange={e => setPrice(e.target.value)}
                value={price}
              />
            </FormControl>
          </div>
          <div className='div-section'>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>Ingredients and Allergy List:</Typography>
              <StyledButton variant="outlined" onClick={toggleListVisibility} style={{ width: 'auto', margin: '10px' }}>
                {isListVisible ? 'Hide Ingredients' : 'Show Ingredients'}
              </StyledButton>
            </div>
            {isListVisible && ingredientAndAllergyList?.map((ingredientAllergyPair, index) => (
              <IngredientAllergyPair
                key={index}
                ingredientAllergyPair={ingredientAllergyPair}
                handleIngredientChange={e => {
                  const updatedList = [...ingredientAndAllergyList];
                  updatedList[index][0] = e.target.value;
                  setIngredientAndAllergyList(updatedList);
                }}
                handleAllergyChange={e => {
                  const updatedList = [...ingredientAndAllergyList];
                  updatedList[index][1] = e.target.value;
                  setIngredientAndAllergyList(updatedList);
                }}
                handleDelete={() => handleDeleteIngredientAllergyPair(index)}
                allergies={allergies}
                ingredientLabel='Ingredient Name'
                allergyLabel='Allergy'
              />
            ))}
          </div>
        </div>
        <div className='food-item-button'>
          {categoryName !== 'Best Selling' && (
            <Button sx={{ color: '#002250' }} onClick={deleteFoodItem} startIcon={<DeleteIcon />} />
          )}
          <StyledButton sx={{ width: '45%' }} onClick={updateFoodItem}>UPDATE</StyledButton>
        </div>
      </div>
    </>
  );
}

export default ManagerFoodItem;
