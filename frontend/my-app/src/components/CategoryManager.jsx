import React from 'react';
import './Components.css';
import { Button, TextField, Card, CardContent, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import makeRequest from '../makeRequest';

function CategoryManager(props) {
  const [categoryName, setCategoryName] = React.useState(props.categoryName);
  const [categoryId, setCategoryId] = React.useState(props.id);
  const managerId = localStorage.getItem('staff_id');
  const menuId = localStorage.getItem('menu_id');

  function deleteCategory() {
    const body = JSON.stringify({
      manager_id: managerId,
      menu_id: menuId,
      category_id: props.id
    });

    makeRequest('/manager/delete_category', 'DELETE', body, undefined)
      .then(data => {
        if (props.currentSelectedCategoryId === categoryId) {
          // deleting the currently selected category should automatically change selected category to best selling
          props.setCurrentSelectedCategoryId(1)
          props.setCurrentSelectedCategory('Best Selling')
        }
        props.fetchAllMenuData();
      })
      .catch(e => console.log('Error: ' + e));
  }

  function reorderCategory(prev_ordering_id, new_ordering_id) {
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
      alert('Cannot reorder categories')
    }
  }

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

      // change currently selected heading name as well
      props.setCurrentSelectedCategory(categoryName);
    } else {
      alert('Invalid category name')
      setCategoryName(props.categoryName)
    }
  }

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
          width: '300px',
          marginRight: '0',
          borderRadius: '20px'
        }}
        className="category-box"
        onClick={() => selectCategory()}
        sx={{ m: 2, p: 7 }}
        variant="outlined"
      >
        <CardContent>
          {categoryName === 'Best Selling' ? (
            <div>Best Selling</div>
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
          <Button sx={{ color: '#002250' }} onClick={() => reorderCategory(props.orderingId, props.getOtherCategoryOrderingId('up', categoryId))} startIcon={<ArrowUpwardIcon />} />
          <Button sx={{ color: '#002250' }} onClick={() => deleteCategory()} startIcon={<DeleteIcon />} />
          <Button sx={{ color: '#002250' }} onClick={() => reorderCategory(props.orderingId, props.getOtherCategoryOrderingId('down', categoryId))} startIcon={<ArrowDownwardIcon />} />
        </Box>
      )}
    </Box>
  );
}

export default CategoryManager;
