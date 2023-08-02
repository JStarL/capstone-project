import React from 'react';
import './Components.css';

/**
 * Represents a Best Selling Food Item component.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.originalImage - The URL of the original food image.
 * @param {string} props.originalFoodName - The name of the original food.
 * @param {string} props.originalFoodDescription - The description of the original food.
 * @param {number} props.originalPrice - The price of the original food.
 * @returns {JSX.Element} The JSX representation of the Best Selling Food Item component.
 */
function BestSellingFoodItem(props) {
  return (
    <>
      <div className='food-item-div'>
        <div>
          {props.originalImage
            ? (
              <div className='image'>
                <img
                  style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }}
                  src={props.originalImage}
                  alt={props.originalFoodName}
                />
              </div>
            )
            : <div className='food-item-img'>IMG</div>
          }
        </div>
        <div className='food-item-middle'>
          <div className='div-section'><b>{props.originalFoodName}</b></div>
          <div className='div-section'><i>{props.originalFoodDescription}</i></div>
          <div className='div-section'><b>Price:</b> ${props.originalPrice}</div>
        </div>
      </div>
    </>
  );
}

export default BestSellingFoodItem;
