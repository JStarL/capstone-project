import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Represents a restaurant details component in the customer interface.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.restaurantName - The name of the restaurant.
 * @param {string} props.restaurantAddress - The address of the restaurant.
 * @param {string} props.menuId - The ID of the menu for the selected restaurant.
 * @param {Function} props.onSuccess - The callback function to be called when a restaurant is selected successfully.
 * @returns {JSX.Element} The JSX representation of the RestaurantDetails component.
 */
function RestaurantDetails(props) {
	// Hook to navigate to other pages
	const navigate = useNavigate();

	// Get sessionId from URL params
	const params = useParams();
	const sessionId = params.sessionId;

	/**
	 * Handles the selection of the restaurant.
	 * Sets the menu ID in local storage and navigates to select table number.
	 */
	function selectRestaurant() {
		// Set menu ID in local storage
		props.onSuccess(props.menuId);

		// Forward user to select table number
		navigate(`/customer/${sessionId}/${props.menuId}/tablenumber`);
	}

	return (
		<div className='food-item-div'>
			<div className='food-item-middle'>
				<div className='div-section'>
					<b>Name: </b>
					{props.restaurantName}
				</div>
				<div className='div-section'>
					<b>Location:</b> {props.restaurantAddress}
				</div>
			</div>
			<div className='food-item-button'>
				<StyledButton
					onClick={() => selectRestaurant()}
					variant='outlined'
					style={{ margin: '10px', padding: '10px' }}
				>
					Select &nbsp; <ArrowForwardIcon />
				</StyledButton>
			</div>
		</div>
	);
}

export default RestaurantDetails;
