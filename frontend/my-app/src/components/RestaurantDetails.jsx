import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function RestaurantDetails(props) {
	const navigate = useNavigate();
	const params = useParams();
	const sessionId = params.sessionId

	function selectRestaurant() {
		// set menu id in local storage 
		localStorage.setItem('menu_id', props.menuId)
		props.onSuccess(props.menuId)
		// forward user to select table number 
		navigate(`/customer/${sessionId}/${props.menuId}/tablenumber`)
	}

	return (
		<div className='food-item-div'>
			<div className='food-item-middle'>
				<div className='div-section'><b>Name: </b>{props.restaurantName}</div>
				<div className='div-section'><b>Location:</b> {props.restaurantAddress}</div>
			</div>
			<div className='food-item-button'>
				<StyledButton onClick={() => selectRestaurant()} variant='outlined' style={{ margin: '10px', padding: '10px'}}>Select &nbsp; <ArrowForwardIcon/></StyledButton>
			</div>
		</div>
	)
}

export default RestaurantDetails;
