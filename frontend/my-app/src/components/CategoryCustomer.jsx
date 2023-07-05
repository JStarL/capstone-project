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
		<Card onClick={() => selectCategory()} sx={{ m: 2, p: 7 }} variant="outlined" >
			<CardContent>
				<Typography>{categoryName}</Typography>
			</CardContent>
			<CardActions>
			</CardActions>
		</Card>
	</>;
}
export default CategoryCustomer;