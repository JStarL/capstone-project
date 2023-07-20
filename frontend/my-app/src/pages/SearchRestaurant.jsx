import React from 'react';
import { Typography, Paper, TextField } from '@mui/material';
import makeRequest from '../makeRequest';
import RestaurantDetails from '../components/RestaurantDetails';

function SearchRestaurant({ onSuccess }) {
	const [searchQuery, setSearchQuery] = React.useState('');
	const [restaurants, setRestaurants] = React.useState([]);

	React.useEffect(() => {
		const fetchData = async () => {
			await fetchRestaurants();
		};
		fetchData();
	}, [searchQuery]);

	async function fetchRestaurants() {
		const url = `/customer/menu/search?session_id=${localStorage.getItem('session_id')}&query=${searchQuery}`;
		const data = await makeRequest(url, 'GET', undefined, undefined);
		setRestaurants(data);
		return data; // Return the fetched data
	}

	return (
		<div className='login-page' sx={{ alignItems: 'center' }}>
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '60%' }}>
				<Typography sx={{ mb: 3 }} variant="h4" gutterBottom>Select Restaurant</Typography>
				<TextField label='Search by Restaurant Name or Location'
					onChange={e => setSearchQuery(e.target.value)}
					variant="outlined"
					sx={{ mb: 3 }}
					fullWidth
					value={searchQuery}
				/>
				<div>
					{restaurants?.map((restaurant) => (
						<RestaurantDetails
							key={restaurant.menu_id}
							restaurantName={restaurant.restaurant_name}
							restaurantAddress={restaurant.restaurant_address}
							menuId={restaurant.menu_id}
							onSuccess={onSuccess}
						>
						</RestaurantDetails>
					))}
				</div>
			</Paper>
		</div>
	);
}

export default SearchRestaurant;
