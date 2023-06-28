import React from 'react';
import { Typography, Card, CardActions, CardContent} from '@mui/material';
function CategoryCustomer() {
	return <>
		<Card onClick={() => console.log('Selecting category')} sx={{m:2, p:7}} variant="outlined" >
			<CardContent>
				<Typography>Category 1</Typography>
			</CardContent>
			<CardActions>
			</CardActions>
		</Card>
  </>;
}
export default CategoryCustomer;