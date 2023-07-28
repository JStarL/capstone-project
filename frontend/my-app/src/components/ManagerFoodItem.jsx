import React from 'react';
import './Components.css';
import { useParams } from 'react-router-dom';
import { Typography, Button, TextField, Input, Select } from '@mui/material';
import { fileToDataUrl } from './helperFunctions';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import makeRequest from '../makeRequest';
import { StyledButton } from '../pages/CustomerOrStaff';
import IngredientAllergyPair from './IngredientAllergyPair';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function ManagerFoodItem({ allergies, fetchAllMenuData, originalFoodName, originalFoodDescription, originalPrice, originalImage, originalIngredients, foodId, categoryId, categoryName, fetchCategoryMenuItems, orderingId, getOtherMenuItemOrderingId, index, menuItemsSize }) {
  const [foodName, setFoodName] = React.useState('');
  const [foodDescription, setFoodDescription] = React.useState('');
  const [ingredientAndAllergyList, setIngredientAndAllergyList] = React.useState(originalIngredients);
  const [image, setImage] = React.useState(originalImage)
  const [price, setPrice] = React.useState(originalPrice);
  const [isListVisible, setListVisible] = React.useState(false);
  const [ingredient, setIngredient] = React.useState('');
  const [selectedAllergy, setSelectedAllergy] = React.useState(0); // New state variable for selected allergy

  const params = useParams()
  React.useEffect(() => {
    setFoodName(originalFoodName)
    setFoodDescription(originalFoodDescription)
    setImage(originalImage)
    setPrice(originalPrice)
    setIngredientAndAllergyList(originalIngredients)
  }, [originalFoodDescription, originalFoodName, originalImage, originalPrice, originalIngredients]);

  async function handleFileSelect(event) {
    const thumbnailUrl = await fileToDataUrl(event.target.files[0])
    setImage(thumbnailUrl);
  }
  const managerId = params.managerId
  const menuId = params.menuId

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

  function reorderMenuItem(prev_ordering_id, new_ordering_id) {
    if (!new_ordering_id) {
      console.log("new_ordering_id is: " + new_ordering_id);
      return;
    }
    const body = JSON.stringify({
      manager_id: managerId,
      menu_item_id: foodId,
      prev_ordering_id,
      new_ordering_id
    });
    if (categoryName !== '') {
      makeRequest('/manager/update_menu_item_ordering', 'POST', body, undefined)
        .then(data => {
          fetchCategoryMenuItems();
        })
        .catch(e => console.log('Error: ' + e));
    } else {
      alert('Cannot reorder categories')
    }
  }

  function toggleListVisibility() {
    setListVisible(!isListVisible);
  }

  function handleDeleteIngredientAllergyPair(index) {
    const updatedList = [...ingredientAndAllergyList];
    updatedList.splice(index, 1);
    setIngredientAndAllergyList(updatedList);
  }

  function addIngredientAllergyPair() {
    setIngredientAndAllergyList([...ingredientAndAllergyList, [ingredient, selectedAllergy]]);
    setSelectedAllergy(0);
    setIngredient('');
  }

  console.log(index)

  return (
    <>
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
              <Typography variant="overline" gutterBottom><b>Ingredients and Allergy List</b></Typography>
              <StyledButton size="small" variant="outlined" onClick={toggleListVisibility} style={{ width: 'auto', margin: '10px', marginBottom: '15px' }}>
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

            {isListVisible
              ?
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TextField
                  sx={{ mb: 2 }}
                  fullWidth
                  label='Add New Ingredient'
                  variant='outlined'
                  value={ingredient}
                  onChange={e => setIngredient(e.target.value)}
                />
                <FormControl sx={{ mb: 2, ml: 2 }} fullWidth>
                  <InputLabel id="allergy-select-label">Add Allergy</InputLabel>
                  <Select
                    labelId="allergy-select-label"
                    id="allergy-select"
                    value={selectedAllergy}
                    onChange={e => setSelectedAllergy(e.target.value)}
                    label="Add Allergy"
                  >
                    {allergies.map((allergy, index) => (
                      <MenuItem key={index} value={allergy[0]}>
                        {allergy[1]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <StyledButton
                  sx={{ mb: 2, ml: 2, width: '10%', height: '20%' }}
                  onClick={() => addIngredientAllergyPair()}
                  startIcon={<AddIcon />}
                ></StyledButton>
              </div>
              : <></>}
          </div>
        </div>
        <div className='food-item-button' style={{ marginRight: '0px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Button disabled={index === 0}
              sx={{ color: '#002250', fontSize: '2vw', margin: '1vw' }}
              onClick={() => reorderMenuItem(orderingId, getOtherMenuItemOrderingId('up', foodId))}
              startIcon={<ArrowUpwardIcon style={{ fontSize: '2vw' }} />}
            />
            <div style={{ margin: '1vw' }}>
              {categoryName !== 'Best Selling' && (
                <Button
                  style={{ color: '#002250', fontSize: '2vw', marginLeft: '1vw', marginRight: '1vw' }}
                  onClick={deleteFoodItem}
                  startIcon={<DeleteIcon style={{ fontSize: '2vw' }} />}
                />
              )}
              <Button
                  style={{ color: '#002250', fontSize: '2vw', marginLeft: '1vw', marginRight: '1vw' }}
                  onClick={updateFoodItem}
                  startIcon={<SaveAltIcon style={{ fontSize: '2vw' }} />}
                />
              {/* <StyledButton style={{ width: 'auto', fontSize: '1vw', marginLeft: '1vw', marginRight: '1vw' }} onClick={updateFoodItem}>
                UPDATE
              </StyledButton> */}
            </div>
            <Button
              sx={{ color: '#002250', fontSize: '2vw', margin: '1vw' }}
              onClick={() => reorderMenuItem(orderingId, getOtherMenuItemOrderingId('down', foodId))}
              startIcon={<ArrowDownwardIcon style={{ fontSize: '2vw' }} />} disabled={index === (menuItemsSize - 1)}
            />
          </div>
        </div>


      </div>
    </>
  );
}

export default ManagerFoodItem;
