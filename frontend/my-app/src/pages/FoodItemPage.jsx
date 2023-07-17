import React from 'react';
import '../App.css';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import { StyledButton } from './CustomerOrStaff';

function FoodItemPage() {
  const navigate = useNavigate();
  // Change to get from params
  const sessionId = localStorage.getItem('session_id');
  const menuId = localStorage.getItem('menu_id');
  const tableNumber = localStorage.getItem('table_number');

  const [foodData, setFoodData] = React.useState({});
  const params = useParams();
  const [foodId, setFoodId] = React.useState(params.foodId);

  React.useEffect(() => {
    setFoodId(params.foodId);
    fetchFoodItemData();
  }, [foodId]);

  async function fetchFoodItemData() {
    const url = `/customer/view_menu_item?session_id=${sessionId}&menu_item_id=${foodId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    console.log(data);

    setFoodData(data);
  }

  function backToMenu() {
    navigate(`/customer/${sessionId}/${menuId}/${tableNumber}`)
    console.log(params.categoryId) // set this to currently selected
  }

  function addToOrder() {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': foodId,
      'amount': 1,
      'title': foodData.food_name
    })
    makeRequest('/customer/add_menu_item', 'POST', body, undefined)
      .then(data => {
        console.log(data)
      })
      .catch(e => console.log('Error: ' + e))
  }

  if (!foodData) return <>loading...</>;

  return (
    <>
      <div className='login-page'>
        <Paper className='paper' elevation={5} sx={{ p: 4, mb: 2, position: 'relative', borderRadius: '20px' }}>
          <StyledButton variant='outlined' onClick={() => backToMenu()} startIcon={<ArrowBackIcon size='large' />} sx={{ position: 'absolute', top: '16px', left: '16px', width: 'auto' }}>
            menu
          </StyledButton>
          <Typography className='h4' variant='h4' gutterBottom>
            {foodData.food_name}
          </Typography>
          {foodData.food_image ? (
            <img style={{ width: '100%', height: 'auto', margin: '5px' }} src={foodData.food_image} alt='Food Item' />
          ) : (
            <div style={{ width: '100%', height: 'auto', margin: '5px' }} className='food-item-img'>
              FOOD IMG
            </div>
          )}
          <div className='div-section'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Ingredients:
            </Typography>
            {foodData.food_ingredients !== undefined && (
              <Typography>
                {foodData.food_ingredients.length > 0
                  ? foodData.food_ingredients.map(ingredients => ingredients[0]).join(', ')
                  : "No ingredients"}
              </Typography>
            )}

          </div>
          <div className='div-section'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Description:
            </Typography>
            <Typography>
              {foodData.food_description}
            </Typography>
          </div>
          <div className='div-section'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Price:
            </Typography>
            <Typography>
              $ {foodData.food_price}
            </Typography>
          </div>
          <Box mt={2}>
            <StyledButton onClick={addToOrder} variant='outlined'>
              Add to Order
            </StyledButton>
          </Box>
        </Paper>
      </div>
    </>
  );
}

export default FoodItemPage;
