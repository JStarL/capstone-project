import { Button, Typography, Card, CardActions, CardContent} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
function Category() {
	return <>
		<Card onClick={() => console.log('Selecting category')} sx={{m:2, p:7}} variant="outlined" >
			<CardContent>
				<Typography> Category 1</Typography>
			</CardContent>
			<CardActions>
				<Button startIcon={<DeleteIcon/>}></Button>			
				<Button startIcon={<MenuIcon/>}></Button>
			</CardActions>
		</Card>
  </>;
}
export default Category;