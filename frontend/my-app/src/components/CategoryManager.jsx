import React from 'react';
import './Components.css';
import { useParams } from 'react-router-dom';
import { Typography, Button, TextField, Card, CardContent, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import makeRequest from '../makeRequest';

/**
 * Component for managing individual categories in a menu.
 *
 * @param {Object} props - Component props
 * @param {string} props.categoryName - The name of the category.
 * @param {number} props.id - The unique identifier of the category.
 * @param {number} props.currentSelectedCategoryId - The currently selected category's ID.
 * @param {Function} props.setCurrentSelectedCategoryId - Function to set the currently selected category's ID.
 * @param {string} props.currentSelectedCategory - The name of the currently selected category.
 * @param {Function} props.setCurrentSelectedCategory - Function to set the currently selected category's name.
 * @param {Function} props.fetchAllMenuData - Function to fetch all menu data.
 * @param {number} props.index - The index of the category in the list.
 * @param {number} props.categoriesSize - The total number of categories in the list.
 * @param {number} props.orderingId - The ordering ID of the category.
 * @param {Function} props.getOtherCategoryOrderingId - Function to get the ordering ID of another category.
 *
 * @returns {JSX.Element} - The JSX element representing the CategoryManager component.
 */
function CategoryManager(props) {
  // State variables
  const [categoryName, setCategoryName] = React.useState(props.categoryName);
  const [categoryId] = React.useState(props.id);

  // Extract managerId and menuId from the URL params
  const params = useParams();
  const managerId = params.managerId;
  const menuId = params.menuId;

  /**
   * Deletes the current category.
   */
  function deleteCategory() {
    const body = JSON.stringify({
      manager_id: managerId,
      menu_id: menuId,
      category_id: props.id
    });

    makeRequest('/manager/delete_category', 'DELETE', body, undefined)
      .then(data => {
        if (props.currentSelectedCategoryId === categoryId) {
          // Deleting the currently selected category should automatically change selected category to "Best Selling".
          props.setCurrentSelectedCategoryId(1);
          props.setCurrentSelectedCategory('Best Selling');
        }
        props.fetchAllMenuData();
      })
      .catch(e => console.log('Error: ' + e));
  }

  /**
   * Reorders the current category.
   *
   * @param {number} prev_ordering_id - The previous ordering ID of the category.
   * @param {number} new_ordering_id - The new ordering ID of the category.
   */
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
      makeRequest('/manager/update_category_ordering', 'POST', body, undefined)
        .then(data => {
          props.fetchAllMenuData();
        })
        .catch(e => console.log('Error: ' + e));
    } else {
      alert('Cannot reorder categories');
    }
  }

  /**
   * Updates the name of the current category.
   */
  function updateCategoryName() {
    const body = JSON.stringify({
      manager_id: managerId,
      category_name: categoryName,
      category_id: props.id
    });
    if (categoryName !== '') {
      makeRequest('/manager/update_category', 'POST', body, undefined)
        .then(data => {
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

  /**
   * Selects the current category.
   */
  function selectCategory() {
    props.setCurrentSelectedCategory(props.categoryName);
    props.setCurrentSelectedCategoryId(categoryId);
  }

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
            <Typography style={{ fontSize: '15px' }} variant='overline'><b>Best Selling</b></Typography>
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
          <Button disabled={props.index === 1} sx={{ color: '#002250' }} onClick={() => reorderCategory(props.orderingId, props.getOtherCategoryOrderingId('up', categoryId))} startIcon={<ArrowUpwardIcon />} />
          <Button sx={{ color: '#002250' }} onClick={() => deleteCategory()} startIcon={<DeleteIcon />} />
          <Button disabled={props.index === props.categoriesSize - 1} sx={{ color: '#002250' }} onClick={() => reorderCategory(props.orderingId, props.getOtherCategoryOrderingId('down', categoryId))} startIcon={<ArrowDownwardIcon />} />
        </Box>
      )}
    </Box>
  );
}

export default CategoryManager;
