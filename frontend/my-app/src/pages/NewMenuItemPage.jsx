import React from 'react';
import '../App.css';
import NewMenuItem from '../components/NewMenuItem';
import { Button } from '@mui/material';

function NewMenuItemPage () {
  return <>NEW MENU ITEM PAGE
    <NewMenuItem></NewMenuItem>
    <Button>Add to Menu</Button>
  </>
}

export default NewMenuItemPage;