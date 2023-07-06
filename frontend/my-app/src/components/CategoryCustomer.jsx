import React from 'react';
import { Typography, Card, CardActions, CardContent } from '@mui/material';
function CategoryCustomer(props) {
	const [categoryName, setCategoryName] = React.useState(props.categoryName);
	const [categoryId, setCategoryId] = React.useState(props.id)

	function selectCategory() {
		props.setCurrentSelectedCategory(categoryName)
		props.setCurrentSelectedCategoryId(categoryId)
    	console.log(categoryId)
	}

	return <>
		<Card onClick={() => selectCategory()} sx={{ m: 2, p: 7 }} style={{width: '300px', borderColor: props.currentSelectedCategoryId === props.id ? '#002250' : undefined, boxShadow: props.currentSelectedCategoryId === props.id ? "0 2px 4px rgba(0, 0, 0, 0.2)" : undefined }} variant="outlined" >
			<CardContent>
				<Typography>{categoryName}</Typography>
			</CardContent>
			<CardActions>
			</CardActions>
		</Card>
	</>;
}
export default CategoryCustomer;