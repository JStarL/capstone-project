import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledButton } from '../pages/CustomerOrStaff';
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

