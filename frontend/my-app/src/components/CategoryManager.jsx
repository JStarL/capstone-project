import React from 'react';
import './Components.css';
import { useParams } from 'react-router-dom';
import { Typography, Button, TextField, Card, CardContent, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import makeRequest from '../makeRequest';

// CategoryManager component takes care of displaying and managing a single category.
function CategoryManager(props) {
  // State variables to manage the category name and id.
  const [categoryName, setCategoryName] = React.useState(props.categoryName);
  const [categoryId] = React.useState(props.id);

  // Get route parameters using useParams from react-router-dom.
  const params = useParams();
  const managerId = params.managerId;
  const menuId = params.menuId;

  // Function to delete the current category.
  function deleteCategory() {
    // Prepare the request body with necessary data.
    const body = JSON.stringify({
      manager_id: managerId,
      menu_id: menuId,
      category_id: props.id
    });

    // Send a request to the server to delete the category.
    makeRequest('/manager/delete_category', 'DELETE', body, undefined)
      .then(data => {
        if (props.currentSelectedCategoryId === categoryId) {
          // If the deleted category was selected, change the selected category to 'Best Selling'.
          props.setCurrentSelectedCategoryId(1);
          props.setCurrentSelectedCategory('Best Selling');
        }
        // Fetch updated menu data after deletion.
        props.fetchAllMenuData();
      })
      .catch(e => console.log('Error: ' + e));
  }

  // Function to reorder the category.
  function reorderCategory(prev_ordering_id, new_ordering_id) {
    if (!new_ordering_id) {
      return;
    }
    const body = JSON.stringify({
      manager_id: managerId,
      category_id: props.id, 
      prev_ordering_id, 
      new_ordering_id
    });
    if (categoryName !== '') {
      // Send a request to the server to update the category's ordering.
      makeRequest('/manager/update_category_ordering', 'POST', body, undefined)
        .then(data => {
          // Fetch updated menu data after reordering.
          props.fetchAllMenuData();
        })
        .catch(e => console.log('Error: ' + e));
    } else {
      alert('Cannot reorder categories');
    }
  }

  // Function to update the category name.
  function updateCategoryName() {
    const body = JSON.stringify({
      manager_id: managerId,
      category_name: categoryName,
      category_id: props.id
    });
    if (categoryName !== '') {
      // Send a request to the server to update the category's name.
      makeRequest('/manager/update_category', 'POST', body, undefined)
        .then(data => {
          // Fetch updated menu data after updating the name.
          props.fetchAllMenuData();
        })
        .catch(e => console.log('Error: ' + e));

      // Change currently selected heading name as well.
      props.setCurrentSelectedCategory(categoryName);
    } else {
      alert('Invalid category name');
      setCategoryName(props.categoryName);
    }
  }

  // Function to select the current category.
  function selectCategory() {
    // Set the selected category name and id in the parent component's state.
    props.setCurrentSelectedCategory(props.categoryName);
    props.setCurrentSelectedCategoryId(categoryId);
  }

  // Render the CategoryManager component.
  return (
    <Box display="flex" alignItems="center">
      <Card
        style={{
          borderColor: props.currentSelectedCategoryId === props.id ? '#002250' : undefined,
          boxShadow: props.currentSelectedCategoryId === props.id ? "0 6px 12px rgba(0, 0, 0, 0.4)" : undefined,
          width: '36vh',
          marginRight: '0',
          borderRadius: '20px'
        }}
        className="category-box"
        onClick={() => selectCategory()}
        sx={{ m: 2, p: 7 }}
        variant="outlined"
      >
  			<CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {categoryName === 'Best Selling' ? (
				    <Typography style={{ fontSize:'15px' }} variant='overline'><b>Best Selling</b></Typography>
          ) : (
            <TextField
              fullWidth
              variant="standard"
              className="food-item-name"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              onBlur={() => updateCategoryName()}
              label="Category Name"
            ></TextField>
          )}
        </CardContent>
      </Card>
      {categoryName === 'Best Selling' ? <div style={{ width: "55px" }}></div> : (
        <Box style={{ width: "55px" }} display="flex" justifyContent='center' flexDirection="column">
          {/* Buttons to reorder and delete the category */}
          <Button disabled={props.index === 1} sx={{ color: '#002250' }} onClick={() => reorderCategory(props.orderingId, props.getOtherCategoryOrderingId('up', categoryId))} startIcon={<ArrowUpwardIcon />} />
          <Button sx={{ color: '#002250' }} onClick={() => deleteCategory()} startIcon={<DeleteIcon />} />
          <Button disabled={props.index === props.categoriesSize - 1} sx={{ color: '#002250' }} onClick={() => reorderCategory(props.orderingId, props.getOtherCategoryOrderingId('down', categoryId))} startIcon={<ArrowDownwardIcon />} />
        </Box>
      )}
    </Box>
  );
}

export default CategoryManager;
