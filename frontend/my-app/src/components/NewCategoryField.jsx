import React from 'react';
import './Components.css';
import { Button, TextField, Card, Box, CardContent, styled, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import makeRequest from '../makeRequest';
import AddCircle from '@mui/icons-material/Add';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { StyledButton } from '../pages/CustomerOrStaff';

function NewCategoryField({ menuId, managerId, fetchAllMenuData }) {
  const [newCategoryName, setNewCategoryName] = React.useState('')
  function addNewCategory() {
    const body = JSON.stringify({
      'manager_id': managerId,
      'menu_id': menuId,
      'category_name': newCategoryName
    });

    if (newCategoryName !== '') {
      makeRequest('/manager/add_category', 'POST', body, undefined)
        .then(data => {
          setNewCategoryName('')
          fetchAllMenuData(); // basically updates/refreshes the page
        })
        .catch(e => console.log('Error: ' + e));
    } else {
      alert('Invalid category name')
    }
  }

	return <>
  <Typography variant='overline' style={{ paddingRight: "35px" }}>Add new Category</Typography>
  <Box style={{ width: "55px" }} display="flex" justifyContent='center' flexDirection="column"></Box>
    <Box display="flex" alignItems="center">
      <Card
        style={{
          width: '300px',
          marginRight: '0'
        }}
        className="category-box"
        sx={{ m: 2, p: 7 }}
        variant="outlined"
      >
        <CardContent>
          <TextField
            label='New Category Name'
            onChange={e => setNewCategoryName(e.target.value)}
            variant="standard"
            sx={{ mb: 3 }}
            value={newCategoryName || ''}
          />
          {/* <StyledButton onClick={addNewCategory} startIcon={<AddCircle />}>Add category</StyledButton> */}
        </CardContent>
      </Card>
      <Box style={{ width: "55px" }} display="flex" justifyContent='center' flexDirection="column">
        <Button sx={{color: '#002250'}} onClick={addNewCategory} startIcon={<LibraryAddIcon />}></Button>
      </Box>
    </Box>
    
	</>;
}
export default NewCategoryField;
