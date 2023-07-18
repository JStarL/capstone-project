import React from 'react';
import './Components.css';
import { Button, TextField, Card, CardActions, CardContent, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import makeRequest from '../makeRequest';
import { useNavigate } from 'react-router-dom';

function CategoryManager(props) {
  const [categoryName, setCategoryName] = React.useState(props.categoryName);
  const [categoryId, setCategoryId] = React.useState(props.id);
  const [prevCategoryName, setPrevCategoryName] = React.useState('');
  const [isClicked, setIsClicked] = React.useState(false);
  const managerId = localStorage.getItem('staff_id');
  const menuId = localStorage.getItem('menu_id');
  const navigate = useNavigate();

  function deleteCategory() {
    const body = JSON.stringify({
      manager_id: managerId,
      menu_id: menuId,
      category_id: props.id
    });

    makeRequest('/manager/delete_category', 'DELETE', body, undefined)
      .then(data => {
        console.log(data)
        if (props.currentSelectedCategoryId === categoryId) {
		      console.log('deleting selected categoyr')
		      console.log('Typeof props.currentSelectedCategoryId: ' + typeof(props.currentSelectedCategoryId) + ' ' + props.currentSelectedCategoryId)
			    console.log('Typeof categoryId: ' + typeof(categoryId) + ' ' + categoryId)
          // deleting the currently selected category should automatically change selected category to best selling
          props.setCurrentSelectedCategoryId(1)
		      props.setCurrentSelectedCategory('Best Selling')
        }
        props.fetchAllMenuData();
      })
      .catch(e => console.log('Error: ' + e));
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
          <Button sx={{color: '#002250'}} onClick={() => console.log(`moving ${categoryName} with ordering ID: ${props.orderingId} up`)} startIcon={<ArrowUpwardIcon/>} />
          <Button sx={{color: '#002250'}} onClick={() => deleteCategory()} startIcon={<DeleteIcon />} />
					<Button sx={{color: '#002250'}} onClick={() => console.log(`moving ${categoryName} with ordering ID: ${props.orderingId} down`)} startIcon={<ArrowDownwardIcon/>} />
        </Box>
      )}
    </Box>
  );
}

export default CategoryManager;
