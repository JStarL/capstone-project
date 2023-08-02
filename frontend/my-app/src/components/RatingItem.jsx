import React, { useState } from 'react';
import './Components.css';
import { Typography } from '@mui/material';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useParams } from 'react-router-dom';

/**
 * Represents a food item with a rating feature for customers.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.foodImage - The image URL of the food item.
 * @param {string} props.foodName - The name of the food item.
 * @param {string} props.foodDescription - The description of the food item.
 * @param {number} props.foodPrice - The price of the food item.
 * @param {number} props.amount - The amount of the food item ordered by the customer.
 * @param {string} props.menu_item_id - The ID of the food item in the menu.
 * @param {Object} props.personas - The personas object containing customer personas.
 * @param {string} props.orderedByPersona - The persona name of the customer who ordered the item.
 * @returns {JSX.Element} The JSX representation of the RatingItem component.
 */
function RatingItem(props) {
  // Component state
  const [rating, setRating] = useState(0); // Initial rating value is 0 (no rating given)
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false); // State to track whether the rating is submitted

  // Get sessionId from URL params
  const params = useParams();
  const sessionId = params.sessionId;

  /**
   * Handles the click on a star to set the rating.
   * @param {number} starRating - The rating value represented by the star clicked.
   */
  const handleStarClick = (starRating) => {
    if (!isRatingSubmitted) {
      setRating(starRating === rating ? 0 : starRating); // Toggle the rating on click if not submitted
    }
  };

  /**
   * Handles the submission of the rating.
   */
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
      alert('Rating cannot be 0');
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
                    color='primary' 
                    style={{ cursor: 'pointer', fontSize: '4rem', marginTop: '10px' }}
                    onClick={() => handleStarClick(starRating)}
                  />
                );
              } else if (starRating - rating === 0.5) {
                return (
                  <StarHalfIcon
                    key={starRating}
                    color='action' 
                    style={{ cursor: 'pointer', fontSize: '4rem', marginTop: '10px' }}
                    onClick={() => handleStarClick(starRating)}
                  />
                );
              } else {
                return (
                  <StarBorderIcon
                    key={starRating}
                    color='action' 
                    style={{ cursor: 'pointer', fontSize: '4rem', marginTop: '10px' }}
                    onClick={() => handleStarClick(starRating)}
                  />
                );
              }
            })}
          </div>
          {isRatingSubmitted ? (
            <Typography sx={{ m: 2 }} variant="overline" gutterBottom>
              <b>Rating submitted</b>
            </Typography>
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
