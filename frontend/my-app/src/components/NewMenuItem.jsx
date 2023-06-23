import React from 'react';
import '../App.css';
import { Button, TextField } from '@mui/material';

function NewMenuItem () {
  return <>
  <div className='new-item-div'>
    <div className='div-section'>
        <TextField className='long input' id='outlined-basic' label='Food Name' variant='outlined'></TextField>
    </div>
    <div className='div-section'>
        <TextField className='long input' id='outlined-basic' label='Description' variant='outlined'></TextField>
    </div>
    <div className='div-section'>
        <TextField className='short input' id='outlined-basic' label='Category' variant='outlined'></TextField>
        <TextField className='short input' id='outlined-basic' label='Price' variant='outlined'></TextField>
    </div>
    <div className='div-section'>
        <TextField className='long input' id='outlined-basic' label='Ingredients' variant='outlined'></TextField>
    </div>
    <Button>
        Add Image
    </Button>
  </div>
  </>
}

export default NewMenuItem;