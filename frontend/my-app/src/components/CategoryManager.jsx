import React from 'react';
import './Components.css';
import { Button, TextField, Card, CardActions, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import makeRequest from '../makeRequest';

function CategoryManager(props) {
	const [categoryName, setCategoryName] = React.useState(props.categoryName);
  const [categoryId, setCategoryId] = React.useState(props.id)
  const [prevCategoryName, setPrevCategoryName] = React.useState('')
  const [isClicked, setIsClicked] = React.useState(false)
	const managerId = localStorage.getItem('staff_id');
  const menuId = localStorage.getItem('menu_id');
	
	function deleteCategory() {
		const body = JSON.stringify({
			'manager_id': managerId,
			'menu_id': menuId,
			'category_id': props.id
		});

		makeRequest('/manager/delete_category', 'DELETE', body, undefined)
			.then(data => {
				props.fetchAllMenuData();
			})
			.catch(e => console.log('Error: ' + e));
	}

	function updateCategoryName() {
		const body = JSON.stringify({
			'manager_id': managerId,
			'category_name': categoryName,
			'category_id': props.id
		});

		makeRequest('/manager/update_category', 'POST', body, undefined)
			.then(data => {
				props.fetchAllMenuData();
			})
			.catch(e => console.log('Error: ' + e));
		
		// change currently selected heading name as well 
		props.setCurrentSelectedCategory(categoryName)
	}

	function selectCategory() {
		props.setCurrentSelectedCategory(props.categoryName)
		props.setCurrentSelectedCategoryId(categoryId)
	}
	return <>
		<Card style={{ borderColor: props.currentSelectedCategoryId === props.id ? '#002250' : undefined }} className='category-box' onClick={() => selectCategory()} sx={{ m: 2, p: 7 }} variant="outlined" >
			<CardContent>
        {categoryName === 'Best Selling'
          ? <div>Best Selling</div>
          : <TextField fullWidth variant="standard" className='food-item-name' value={categoryName} onChange={e => setCategoryName(e.target.value)} onBlur={() => updateCategoryName()} label='Category Name'></TextField>
        }
			</CardContent>
			<CardActions>
        {categoryName === 'Best Selling'
          ? null
          : <>
          <Button onClick={() => deleteCategory()}startIcon={<DeleteIcon />}>Delete</Button></>
          // <Button startIcon={<MenuIcon />}></Button></>
        }
			</CardActions>
		</Card>
	</>;
}
export default CategoryManager;
