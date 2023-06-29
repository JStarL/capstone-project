import React from 'react';
import PropTypes from 'prop-types';

import { Button, TextField, Card, CardActions, CardContent} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
function CategoryManager(props) {
	const [categoryName, setCategoryName] = React.useState(props.categoryName);
	return <>
		<Card onClick={() => console.log(`Selecting category ${categoryName}`)} sx={{m:2, p:7}} variant="outlined" >
			<CardContent>
				<TextField className='food-item-name' value={categoryName} onChange={e => setCategoryName(e.target.value)} onBlur={() => console.log(`Send request to backend to change name to ${categoryName}`)}label='Category Name'></TextField>
			</CardContent>
			<CardActions>
				<Button startIcon={<DeleteIcon/>}></Button>			
				<Button startIcon={<MenuIcon/>}></Button>
			</CardActions>
		</Card>
  </>;
}
export default CategoryManager;

CategoryManager.propTypes = {
	string: PropTypes.string
};
