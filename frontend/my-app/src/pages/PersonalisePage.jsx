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

function PersonalisePage() {
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
    console.log(selectedAllergies);
  };

  return (
    <>
      <div className="login-page" sx={{ alignItems: 'center' }}>
        <Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '60%' }}>
          <Typography sx={{ mb: 3 }} variant="h4" gutterBottom>
            Personalise
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <div>
              {allergies?.map((allergy) => (
                <FormControlLabel
                  key={allergy[0]}
                  control={
                    <Checkbox
                      onChange={handleCheckboxChange}
                      value={allergy[0]}
                    />
                  }
                  label={`${allergy[1]}: ${allergy[2]}`}
                  value={allergy[0]}
                />
              ))}
            </div>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Paper>
      </div>
    </>
  );
}

export default PersonalisePage;
