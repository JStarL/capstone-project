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

function NewMenuItem(props) {
  const [foodName, setFoodName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [ingredient, setIngredient] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [image, setImage] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [ingredientAndAllergyList, setIngredientAndAllergyList] = React.useState([]);
  const [allergies, setAllergies] = React.useState([[0, 'None', 'No allergies']]);
  const [selectedAllergy, setSelectedAllergy] = React.useState(0); // New state variable for selected allergy

  const params = useParams();
  const navigate = useNavigate();
  const manager_id = localStorage.getItem('staff_id');
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
      'ingredients': ingredient,
      'description': description !== null ? description : undefined,
    });

    makeRequest('/manager/add_menu_item', 'POST', body, undefined)
      .then(data => {
        console.log(data);
        navigate(`/manager/menu/${menu_id}`);
      })
      .catch(e => console.log('Error: ' + e));
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllergies();
      console.log(data);
    };
    fetchData();
  }, []);

  async function fetchAllergies() {
    const url = '/get_allergies';
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setAllergies([...allergies, ...data]);
    console.log(allergies)
    return data;
  }

  async function handleFileSelect(event) {
    setImageName(event.target.files[0].name);
    const thumbnailUrl = await fileToDataUrl(event.target.files[0]);
    setImage(thumbnailUrl);
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
            <div style={{ display: 'flex', flexDirection: 'row', alignItems:'center'}}>
              <TextField
                sx={{ mb:2 }}
                fullWidth
                label='Add Ingredient'
                variant='outlined'
                value={ingredient}
                onChange={e => setIngredient(e.target.value)}
              />
              <FormControl sx={{ mb:2, ml: 2 }} fullWidth>
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
                sx={{ mb: 2, ml: 2, width: '10%', height: '20%'}}
                onClick={() => console.log('add ingredient')}
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
      </div>
    </>
  );
}

export default NewMenuItem;
