import React from 'react';
import {
	Typography,
	Paper,
	Checkbox,
	FormControlLabel,
	Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import { StyledButton } from './CustomerOrStaff';

function PersonalisePage({ handlePersonas }) {
	const [allergies, setAllergies] = React.useState([]);
	const [selectedAllergies, setSelectedAllergies] = React.useState([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const data = await fetchAllergies();
			console.log(data);
		};
		fetchData();
	}, []);

	async function fetchAllergies() {
		const url = '/get_allergies';
		const data = await makeRequest(url, 'GET', undefined, undefined);
		setAllergies(data);
		return data;
	}

	const handleCheckboxChange = (event) => {
		const { value, checked } = event.target;
		if (checked) {
			setSelectedAllergies((prevSelectedAllergies) => [
				...prevSelectedAllergies,
				value,
			]);
		} else {
			setSelectedAllergies((prevSelectedAllergies) =>
				prevSelectedAllergies.filter((allergy) => allergy !== value)
			);
		}
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
    handlePersonas(selectedAllergies)
		console.log(selectedAllergies);
	};

	return (
		<>
			<div className="login-page" sx={{ alignItems: 'center' }}>
				<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '80vh' }}>
					<Typography sx={{ mb: 3 }} variant="h4" gutterBottom>
						Personalise
					</Typography>
					<form onSubmit={handleFormSubmit}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent:'center', 
								alignItems:'center'
							}}
						>
							{allergies?.map((allergy) => (
								<FormControlLabel
									key={allergy[0]}
									control={
										<Checkbox
											onChange={handleCheckboxChange}
											value={allergy[0]}
										/>
									}
									label={
										<div style={{
											padding: '10px',
											margin: '10px',
											boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
											borderRadius: '20px', 
											width: '70vh'
										}}>
											<Typography
												variant="h6"
												gutterBottom
												sx={{ textAlign: 'left' }} // Add textAlign: 'left' style
											>
												<b>{allergy[1]}</b>
											</Typography>
											<Typography sx={{ textAlign: 'left' }} variant="body1" gutterBottom>
												{allergy[2]}
											</Typography>
										</div>
									}
									value={allergy[0]}
								/>
							))}
						</div>
						<StyledButton sx={{width:'80%', p:1, mt:2}} variant='outlined' type="submit" color="primary">
							Add Persona
						</StyledButton>
					</form>
				</Paper>
			</div>
		</>
	);
}

export default PersonalisePage;
