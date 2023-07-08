import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';

function PersonalisePage() {
	const [allergies, setAllergies] = React.useState([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const data = await fetchAllergies();
			console.log(data)
		};
		fetchData();
	}, []);

	async function fetchAllergies() {
		const url = `/customer/get_allergies?session_id=${localStorage.getItem('session_id')}`;
		const data = await makeRequest(url, 'GET', undefined, undefined);
		setAllergies(data)
		return data;
	}

	return (
		<>
			<div className='login-page' sx={{ alignItems: 'center' }}>
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '60%' }}>
				<Typography sx={{ mb: 3 }} variant="h4" gutterBottom>Personalise</Typography>
				<div>
					{allergies?.map((allergy) => (
						console.log(allergy)
					))}
				</div>
			</Paper>
		</div>
		</>
	)
}

export default PersonalisePage;
