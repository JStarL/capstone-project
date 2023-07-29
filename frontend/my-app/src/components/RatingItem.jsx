import React, { useState } from 'react';
import './Components.css';
import { TextField } from '@mui/material';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import StarIcon from '@mui/icons-material/Star';

function RatingItem(props) {
	const [rating, setRating] = useState(0); // Initial rating value is 0 (no rating given)

	const handleStarClick = (starRating) => {
		setRating(starRating === rating ? 0 : starRating); // Toggle the rating on click
	};

	const handleRatingSubmit = () => {
		console.log(`Submit rating for menu item: ${props.foodName} with Id: ${props.menu_item_id} with rating: ${rating}`)
		// // Here you can submit the rating to the server using the makeRequest function
		// // Example: Assuming you have an API endpoint '/submit_rating'
		// const body = JSON.stringify({
		// 	session_id: props.sessionId,
		// 	menu_id: props.menuId,
		// 	menu_item_id: props.menu_item_id,
		// 	rating: rating,
		// });

		// makeRequest('/submit_rating', 'POST', body, undefined)
		// 	.then((data) => {
		// 		console.log(data);
		// 		// Handle success message or update the UI as needed
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error submitting rating:', error);
		// 		// Handle error or show an error message
		// 	});
	};

	return (
		<>
			<div className='food-item-div' style={{ width: '70%' }}>
				<div>
					{props.foodImage ? (
						<div className='image'>
							<img
								style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }}
								src={props.foodImage}
								alt={props.foodName}
							/>
						</div>
					) : (
						<div className='food-item-img'>IMG</div>
					)}
				</div>
				<div className='food-item-middle' style={{ padding: '10px', width: '40%' }}>
					<div className='div-section'>
						<b>{props.foodName}</b>
					</div>
					<div className='div-section'>
						<i>{props.foodDescription}</i>
					</div>
					<div className='div-section'>
						<b>Ordered By: </b>
						{props.personas[props.orderedByPersona][0]}
					</div>
					<div className='div-section'>
						<b>Price:</b> ${props.foodPrice}
					</div>
					<div className='div-section'>
						<b>Amount Ordered:</b> {props.amount}
					</div>
				</div>
				<div style={{ margin: '12px', padding: '10px', alignItems: 'center', justifyContent: 'center' }}>
					<div className='div-section'>
						<b>Your Rating:</b>
					</div>
					<div>
						{[1, 2, 3, 4, 5].map((starRating) => (
							<StarIcon
								key={starRating}
								color={starRating <= rating ? 'primary' : 'action'}
								style={{ cursor: 'pointer' }}
								onClick={() => handleStarClick(starRating)} // Call handleStarClick when a star is clicked
								sx={{ fontSize:'4rem', marginTop: '10px'}}
							/>
						))}
					</div>
					<StyledButton onClick={handleRatingSubmit} variant='outlined' style={{marginTop: '20px'}}>
						Submit Rating
					</StyledButton>
				</div>
			</div>
		</>
	);
}

export default RatingItem;
