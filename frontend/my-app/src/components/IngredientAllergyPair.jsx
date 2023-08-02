import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledButton } from '../pages/CustomerOrStaff';

/**
 * Represents a pair of ingredient and allergy for managing allergies in a form.
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.ingredientAllergyPair - An array containing the ingredient and associated allergy.
 * @param {Array} props.allergies - An array of allergies to populate the allergy selection.
 * @param {Function} props.handleAllergyChange - Function to handle changes in the selected allergy.
 * @param {Function} props.handleIngredientChange - Function to handle changes in the ingredient input field.
 * @param {Function} props.handleDelete - Function to handle the deletion of the ingredient-allergy pair.
 * @param {string} props.ingredientLabel - The label for the ingredient input field.
 * @param {string} props.allergyLabel - The label for the allergy selection field.
 * @returns {JSX.Element} The JSX representation of the IngredientAllergyPair component.
 */

function IngredientAllergyPair({ ingredientAllergyPair, allergies, handleAllergyChange, handleIngredientChange, handleDelete, ingredientLabel, allergyLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        label={ingredientLabel}
        variant='outlined'
        value={ingredientAllergyPair[0]}
        onChange={handleIngredientChange}
      />
      <FormControl sx={{ mb: 2, ml: 2 }} fullWidth>
        <InputLabel id="allergy-select-label">Allergy</InputLabel>
        <Select
          labelId="allergy-select-label"
          id="allergy-select"
          value={ingredientAllergyPair[1]}
          onChange={handleAllergyChange}
          label={allergyLabel}
        >
          {allergies.map(allergy => (
            <MenuItem key={allergy[0]} value={allergy[0]}>
              {allergy[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <StyledButton
        sx={{ mb: 2, ml: 2, width: '10%', height: '20%' }}
        onClick={handleDelete}
        startIcon={<DeleteIcon />}
      ></StyledButton>
    </div>
  );
}

export default IngredientAllergyPair;
