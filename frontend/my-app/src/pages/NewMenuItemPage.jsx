import React from 'react';
import '../App.css';
import NewMenuItem from '../components/NewMenuItem';
import { useParams } from 'react-router-dom';

/**
 * Represents the NewMenuItemPage component that allows adding a new menu item to a specific category.
 * @returns {JSX.Element} The JSX representation of the NewMenuItemPage component.
 */
function NewMenuItemPage() {
  const params = useParams();
  const categoryName = params.categoryName;

  return (
    <>
      {/* Render the NewMenuItem component with the categoryName prop */}
      <NewMenuItem categoryName={categoryName} />
    </>
  );
}

export default NewMenuItemPage;
