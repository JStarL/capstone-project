import React from 'react';
import '../App.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, TextField, Input, Typography, Paper } from '@mui/material';
import { fileToDataUrl } from './helperFunctions'
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import makeRequest from '../makeRequest';
import { StyledButton } from '../pages/CustomerOrStaff';
import AddIcon from '@mui/icons-material/Add';
import IngredientAllergyPair from './IngredientAllergyPair';

function NewMenuItem(props) {
  const [foodName, setFoodName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [ingredient, setIngredient] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [image, setImage] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [ingredientAndAllergyList, setIngredientAndAllergyList] = React.useState([]);
  const [allergies, setAllergies] = React.useState([]);
  const [selectedAllergy, setSelectedAllergy] = React.useState(0); // New state variable for selected allergy

  const params = useParams();
  const navigate = useNavigate();
  const manager_id = params.managerId
  const category_id = params.categoryId;
  const menu_id = params.menuId;

  function addMenuItem() {
    const body = JSON.stringify({
      'manager_id': manager_id,
      'menu_id': menu_id,
      'category_id': category_id,
      'title': foodName,
      'image': image !== null ? image : undefined,
      price,
      'ingredients': ingredientAndAllergyList,
      'description': description !== null ? description : undefined,
    });

    makeRequest('/manager/add_menu_item', 'POST', body, undefined)
      .then(data => {
        navigate(`/manager/menu/${menu_id}/${manager_id}`);
      })
      .catch(e => console.log('Error: ' + e));
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllergies();
    };
    fetchData();
  }, []);

  async function fetchAllergies() {
    const url = '/get_allergies';
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setAllergies([...allergies, ...data]);
    return data;
  }

  async function handleFileSelect(event) {
    setImageName(event.target.files[0].name);
    const thumbnailUrl = await fileToDataUrl(event.target.files[0]);
    setImage(thumbnailUrl);
  }

  function addIngredientAllergyPair() {
    setIngredientAndAllergyList([...ingredientAndAllergyList, [ingredient, selectedAllergy]])
    setSelectedAllergy(0)
    setIngredient('')
  }

  function handleDelete(index) {
    const updatedList = [...ingredientAndAllergyList];
    updatedList.splice(index, 1);
    setIngredientAndAllergyList(updatedList);
  }

  return (
    <>
      <div className='login-page'>
        <Paper sx={{ p: 4, borderRadius: '20px', width: '50%' }} elevation={5}>
          <form className='login-form'>
            <Typography className='h4' variant="h4" gutterBottom>
              Add new menu item to <b>{props.categoryName}</b>
            </Typography>
            <TextField
              sx={{ mb: 2 }}
              className='long input'
              label='Food Name'
              variant='outlined'
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
            />
            <TextField
              sx={{ mb: 2 }}
              className='long input'
              label='Description'
              variant='outlined'
              rows={3}
              multiline={true}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
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
            {ingredientAndAllergyList.length === 0
              ? <Typography style={{
                color: 'red',
                borderColor: props.currentSelectedCategoryId === props.id ? '#002250' : undefined,
                boxShadow: props.currentSelectedCategoryId === props.id ? "0 3px 6px rgba(0, 0, 0, 0.4)" : undefined,
                borderRadius: '10px',
                padding: '5px',
                marginBottom: '30px'
              }} variant="h6" gutterBottom>You have not added any ingredients! Please use the plus button below to add ingredients ↓</Typography>
              : <Typography variant="h6" gutterBottom>Ingredients and Allergy List:</Typography>
            }
            {ingredientAndAllergyList?.map((ingredientAllergyPair, index) => (
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
                handleDelete={() => handleDelete(index)}
                allergies={allergies}
                ingredientLabel='Ingredient Name'
                allergyLabel='Allergy'
              />
            ))}

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
                  {allergies.map(allergy => (
                    <MenuItem key={allergy[0]} value={allergy[0]}>
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

            {image ? (
              <div className='image'>
                <img style={{ height: '300px', width: '300px' }} src={image} alt="Item Image" />
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <Typography variant='overline' sx={{ fontSize: '10px' }}>{imageName}</Typography>
            </div>
            <div>
              <label htmlFor="upload-photo">
                <StyledButton sx={{ mb: 2 }} variant='outlined' aria-label="upload picture" component="label">
                  Add Image
                  <Input
                    style={{ display: 'none' }}
                    accept='image/png, image/jpeg'
                    type="file"
                    onChange={handleFileSelect}
                  />
                </StyledButton>
              </label>
            </div>
            <StyledButton sx={{ mb: 2 }} variant='outlined' onClick={addMenuItem}>
              ADD TO MENU
            </StyledButton>
          </form>
        </Paper>
      </div >
    </>
  );
}

export default NewMenuItem;
