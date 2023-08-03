import React from 'react';
import { Typography, Paper, Checkbox, FormControlLabel, TextField, Card } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import { StyledButton } from './CustomerOrStaff';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

/**
 * Represents the PersonalisePage component that allows customers to personalize their allergies.
 * @param {Object} props - The props object that contains the personas, handlePersonas, and handleCurrentlySelectedPersona functions.
 * @param {Array} props.personas - An array of personas.
 * @param {Function} props.handlePersonas - A function to handle the personas.
 * @param {Function} props.handleCurrentlySelectedPersona - A function to handle the currently selected persona.
 * @returns {JSX.Element} The JSX representation of the PersonalisePage component.
 */
function PersonalisePage({ personas, handlePersonas, handleCurrentlySelectedPersona }) {
  const [allergies, setAllergies] = React.useState([]);
  const [personaName, setPersonaName] = React.useState('');
  const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState('');
  const [selectedAllergies, setSelectedAllergies] = React.useState([1, 2, 3]);
  const [newPersona, setNewPersona] = React.useState(true);

  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params.sessionId;
  const menuId = params.menuId;
  const tableNumber = params.tableNumber;

  /**
   * Use Effect hook to fetch all allergies
   */
  React.useEffect(() => {
    const fetchData = async () => {
      await fetchAllergies();
    };
    fetchData();
  }, []);

  /**
   * Use Effect hook to update current allergies when persona is changed
   */
  React.useEffect(() => {
    if (currentlySelectedPersona) {
      setSelectedAllergies(currentlySelectedPersona[1]);
    } else {
      setSelectedAllergies([]);
    }
  }, [currentlySelectedPersona]);

  // Fetches all allergies from the backend
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
    if (personaName === '') {
      alert('Persona Name cannot be empty');
      return;
    }
    handlePersonas(personaName, selectedAllergies);
    handleCurrentlySelectedPersona(personaName, selectedAllergies);
    navigate(`/customer/${sessionId}/${menuId}/${tableNumber}`);
  };

  const handlePersonaChange = (persona) => {
    setCurrentlySelectedPersona(persona);
    setPersonaName(persona[0]);
    setNewPersona(false);
  };

  const handleNewPersona = () => {
    setCurrentlySelectedPersona('');
    setPersonaName('');
    setNewPersona(true);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '100px', flexDirection: 'column' }}>
          {personas.slice(1).map((persona) => (
            <Card
              key={persona[0]}
              sx={{ m: 2, p: 7 }}
              style={{
                width: '300px',
                borderColor: currentlySelectedPersona[0] === persona[0] ? '#002250' : undefined,
                boxShadow: currentlySelectedPersona[0] === persona[0] ? '0 6px 12px rgba(0, 0, 0, 0.4)' : undefined,
                borderRadius: '20px'
              }}
              variant="outlined"
              onClick={() => { handlePersonaChange(persona) }}
            >
              <Typography style={{ fontSize: '14px' }} variant="overline"><b>{persona[0]}</b></Typography>
            </Card>
          ))}
          <Card
            key="newPersona"
            sx={{ m: 2, p: 7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            style={{
              width: '300px',
              borderColor: newPersona ? '#002250' : undefined,
              boxShadow: newPersona ? '0 6px 12px rgba(0, 0, 0, 0.4)' : undefined,
              borderRadius: '20px'
            }}
            variant="outlined"
            onClick={handleNewPersona}
          >
            <PersonAddAlt1Icon fontSize="small" style={{ marginBottom: '10px' }} />
            <Typography variant="overline" style={{ fontSize: '14px' }}><b>Add New Persona</b></Typography>
          </Card>
        </div>
        <div style={{ marginRight: '250px' }} className="login-page" sx={{ alignItems: 'center' }}>
          <Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '80vh' }}>
            <Typography sx={{ mb: 3 }} variant="h4" gutterBottom>
              Personalise
            </Typography>
            {newPersona ? (
              <TextField
                label="Persona Name"
                sx={{ m: 2, width: '90%' }}
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
              />
            ) : <Typography variant="overline" style={{ margin: '15px', fontSize: '18px' }}><b>{personaName}</b></Typography>}
            <form onSubmit={handleFormSubmit}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {allergies?.slice(0, allergies.length - 1).map((allergy) => (
                  <FormControlLabel
                    key={allergy[0]}
                    control={
                      <Checkbox
                        onChange={handleCheckboxChange}
                        checked={selectedAllergies?.includes(allergy[0].toString())}
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
                          sx={{ textAlign: 'left' }}
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
              <StyledButton sx={{ width: '80%', p: 1, mt: 2 }} variant="outlined" type="submit" color="primary">
                {newPersona ? 'Add Persona' : 'Edit Allergies'}
              </StyledButton>
            </form>
          </Paper>
        </div>
      </div>
    </>
  );
}

export default PersonalisePage;
