import React from 'react';
import { Typography, Paper, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import RestaurantDetails from '../components/RestaurantDetails';

/**
 * Represents the SearchRestaurant component that allows customers to search for restaurants.
 * @param {Object} props - The props object that contains the onSuccess function.
 * @param {Function} props.onSuccess - A function to be called upon successful restaurant selection.
 * @returns {JSX.Element} The JSX representation of the SearchRestaurant component.
 */
function SearchRestaurant({ onSuccess }) {
  // State variables
	const [searchQuery, setSearchQuery] = React.useState('');
	const [restaurants, setRestaurants] = React.useState([]);

  // Extract sessionId from the URL params
	const params = useParams();
	const sessionId = params.sessionId;

	/**
		* Use Effect hook to fetch all restaurants that match the searchQuery
		*/
	React.useEffect(() => {
		const fetchData = async () => {
			await fetchRestaurants();
		};
		fetchData();
	}, [searchQuery]);

	/**
	 * Fetches the restaurants based on the search query.
	 * @returns {Array} The array of restaurants matching the search query.
	 */
	async function fetchRestaurants() {
		const url = `/customer/menu/search?session_id=${sessionId}&query=${searchQuery}`;
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
					{restaurants?.map((restaurant, index) => (
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
