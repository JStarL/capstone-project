import React from 'react';
import { Typography, Card, CardActions, CardContent } from '@mui/material';
function CategoryCustomer(props) {
	const [categoryName] = React.useState(props.categoryName);
	const [categoryId] = React.useState(props.id)

	function selectCategory() {
		props.setCurrentSelectedCategory(categoryName)
		props.setCurrentSelectedCategoryId(categoryId)
	}

	return <>
		<Card
			onClick={() => selectCategory()} 
			sx={{ m: 2, p: 7 }} 
			style={{
				width: '40vh', 
				borderColor: props.currentSelectedCategoryId === props.id ? '#002250' : undefined, 
				boxShadow: props.currentSelectedCategoryId === props.id ? "0 6px 12px rgba(0, 0, 0, 0.4)" : undefined,
				borderRadius: '20px',
				textAlign: 'center'
			}} variant="outlined" >
  			<CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
				<Typography style={{ fontSize:'15px' }} variant='overline'><b>{categoryName}</b></Typography>
			</CardContent>
			<CardActions>
			</CardActions>
		</Card>
	</>;
}
export default CategoryCustomer;