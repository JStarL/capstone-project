import React from 'react';
import './Components.css';
import { Button, TextField, Card, Box, CardContent, Typography } from '@mui/material';
import makeRequest from '../makeRequest';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

/**
 * Represents a component to add a new category.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.menuId - The ID of the menu.
 * @param {string} props.managerId - The ID of the manager.
 * @param {Function} props.fetchAllMenuData - A function to fetch all menu data and refresh the page.
 * @returns {JSX.Element} The JSX representation of the NewCategoryField component.
 */
function NewCategoryField({ menuId, managerId, fetchAllMenuData }) {
  // State variable
  const [newCategoryName, setNewCategoryName] = React.useState('')

  /**
   * Adds a new category to the menu.
   */
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
          fetchAllMenuData(); // Refreshes the page to update the categories
        })
        .catch(e => console.log('Error: ' + e));
    } else {
      alert('Invalid category name')
    }
  }

  return (
    <>
      <Typography variant='overline' style={{ paddingRight: "35px" }}>Add new Category</Typography>
      <Box style={{ width: "55px" }} display="flex" justifyContent='center' flexDirection="column"></Box>
      <Box display="flex" alignItems="center">
        <Card
          style={{
            width: '300px',
            marginRight: '0',
            borderRadius: '20px'
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
          </CardContent>
        </Card>
        <Box style={{ width: "55px" }} display="flex" justifyContent='center' flexDirection="column">
          <Button sx={{ color: '#002250' }} onClick={addNewCategory} startIcon={<LibraryAddIcon />}></Button>
        </Box>
      </Box>
    </>
  );
}

export default NewCategoryField;
