import React, { useState } from 'react';
import './Components.css';
import { TextField, Typography } from '@mui/material';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useParams } from 'react-router-dom';

function RatingItem(props) {
	const params = useParams();
	const sessionId = params.sessionId;

	const [rating, setRating] = useState(0); // Initial rating value is 0 (no rating given)
	const [isRatingSubmitted, setIsRatingSubmitted] = useState(false); // State to track whether the rating is submitted

	const handleStarClick = (starRating) => {
		if (!isRatingSubmitted) {
			setRating(starRating === rating ? 0 : starRating); // Toggle the rating on click if not submitted
		}
	};

	const handleRatingSubmit = () => {
		if (rating !== 0 && !isRatingSubmitted) {
			const body = JSON.stringify({
				session_id: sessionId,
				menu_item_id: props.menu_item_id,
				rating: rating,
				amount: props.amount
			});

			makeRequest('/customer/give_rating', 'POST', body, undefined)
				.then((data) => {
					// Handle success message or update the UI as needed
					setIsRatingSubmitted(true); // Set the flag to indicate rating is submitted
				})
				.catch((error) => {
					console.error('Error submitting rating:', error);
					// Handle error or show an error message
				});
		} else {
			alert('Rating cannot be 0')
		}
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
						{[1, 2, 3, 4, 5].map((starRating) => {
							if (starRating <= rating) {
								return (
									<StarIcon
										key={starRating}
										color='primary' // Set the color to 'primary' to make the filled stars yellow
										style={{ cursor: 'pointer', fontSize: '4rem', marginTop: '10px' }}
										onClick={() => handleStarClick(starRating)}
									/>
								);
							} else if (starRating - rating === 0.5) {
								return (
									<StarHalfIcon
										key={starRating}
										color='action' // Set the color to 'action' for the half-filled stars (default color)
										style={{ cursor: 'pointer', fontSize: '4rem', marginTop: '10px' }}
										onClick={() => handleStarClick(starRating)}
									/>
								);
							} else {
								return (
									<StarBorderIcon
										key={starRating}
										color='action' // Set the color to 'action' for the empty stars (default color)
										style={{ cursor: 'pointer', fontSize: '4rem', marginTop: '10px' }}
										onClick={() => handleStarClick(starRating)}
									/>
								);
							}
						})}
					</div>
					{isRatingSubmitted ? (
						<Typography sx={{ m: 2 }} variant="overline" gutterBottom><b>Rating submitted</b></Typography>
					) : (
						<StyledButton onClick={handleRatingSubmit} variant='outlined' style={{ marginTop: '20px' }}>
							Submit Rating
						</StyledButton>
					)}
				</div>
			</div>
		</>
	);
}

export default RatingItem;
