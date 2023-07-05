import React from 'react';
import '../App.css';
import { Button, TextField, Typography, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';

function FoodItemPage() {
	const navigate = useNavigate();
	const sessionId = localStorage.getItem('session_id');
	const [foodData, setFoodData] = React.useState({}); 
	const params = useParams()
	const [foodId, setFoodId] = React.useState(params.foodId); 

	React.useEffect(() => {
		setFoodId(params.foodId)
		fetchFoodItemData()
	}, [foodId]);

	async function fetchFoodItemData() {
		// CHANGE URL WHEN MENU ID is stored after searching a restaurant
		const url = `/customer/view_menu_item?session_id=${sessionId}&menu_item_id=${foodId}`;
		const data = await makeRequest(url, 'GET', undefined, undefined)
		console.log(data)
		setFoodData(data)
	}
	if (!foodData) return <>loading...</>;

	return <>
		<div className='login-page'>
			{/* change the navigate later when customer route is more dynamic */}
			<Button onClick={() => navigate('/customer/1')} startIcon={<ArrowBackIcon size='large' />}>Go Back</Button>
			<Paper className='paper' elevation={3} sx={{ p: 8, mb: 2}}>

				<Typography className='h4' variant="h4" gutterBottom>{foodData.food_name}</Typography>
				<div className='food-item-div'>
					<div>
						{foodData.image
							? <div className='image'><img style={{ height: '200px', width: '200px', margin: '5px' }} src={foodData.food_image}></img></div>
							: <div className='food-item-img'>IMG</div>}
					</div>
					<div className='food-item-middle'>
						<div className='div-section'>Ingredients: {foodData.food_ingredients}</div>
						<div className='div-section'>Description: {foodData.food_description}</div>
						<div className='div-section'><b>Price: $ {foodData.food_price}</b></div>
					</div>
					<div className='food-item-button'>
						<Button>Add to Order</Button>
					</div>
				</div>
			</Paper>
		</div>
	</>
}

export default FoodItemPage;