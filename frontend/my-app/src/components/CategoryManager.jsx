import React from 'react';
import { Button, TextField, Card, CardActions, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import makeRequest from '../makeRequest';

function CategoryManager(props) {
	const [categoryName, setCategoryName] = React.useState(props.categoryName);
	
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
				console.log(data);
				props.fetchAllMenuData();
			})
			.catch(e => console.log('Error: ' + e));
	}
	return <>
		<Card onClick={() => props.setCurrentSelectedCategory(props.categoryName)} sx={{ m: 2, p: 7 }} variant="outlined" >
			<CardContent>
				<TextField className='food-item-name' value={categoryName} onChange={e => setCategoryName(e.target.value)} onBlur={() => console.log(`Send request to backend to change name to ${categoryName}`)} label='Category Name'></TextField>
			</CardContent>
			<CardActions>
				<Button onClick={() => deleteCategory()}startIcon={<DeleteIcon />}></Button>
				<Button startIcon={<MenuIcon />}></Button>
			</CardActions>
		</Card>
	</>;
}
export default CategoryManager;
