import React from 'react';
import { Typography, Card, CardActions, CardContent } from '@mui/material';

/**
 * Represents a Category Customer component.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.categoryName - The name of the category.
 * @param {number} props.id - The ID of the category.
 * @param {number} props.currentSelectedCategoryId - The ID of the currently selected category.
 * @param {Function} props.setCurrentSelectedCategory - Function to set the currently selected category name.
 * @param {Function} props.setCurrentSelectedCategoryId - Function to set the currently selected category ID.
 * @returns {JSX.Element} The JSX representation of the Category Customer component.
 */
function CategoryCustomer(props) {
  /**
   * Handles the selection of a category.
   */
  function selectCategory() {
    props.setCurrentSelectedCategory(props.categoryName);
    props.setCurrentSelectedCategoryId(props.id);
  }

  return (
    <>
      <Card
        onClick={() => selectCategory()}
        sx={{ m: 2, p: 7 }}
        style={{
          width: '40vh',
          borderColor: props.currentSelectedCategoryId === props.id ? '#002250' : undefined,
          boxShadow: props.currentSelectedCategoryId === props.id ? "0 6px 12px rgba(0, 0, 0, 0.4)" : undefined,
          borderRadius: '20px',
          textAlign: 'center'
        }}
        variant="outlined"
      >
        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography style={{ fontSize: '15px' }} variant='overline'><b>{props.categoryName}</b></Typography>
        </CardContent>
        <CardActions>
        </CardActions>
      </Card>
    </>
  );
}

export default CategoryCustomer;
