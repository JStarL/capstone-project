import React from 'react';
import '../App.css';
import NewMenuItem from '../components/NewMenuItem';
import { useParams } from 'react-router-dom';

function NewMenuItemPage () {
  const params = useParams()
  const categoryName = params.categoryName
  return <>
    <NewMenuItem categoryName={categoryName}/>
  </>
}

export default NewMenuItemPage;