import React from 'react';
import '../App.css';
import NewStaffForm from '../components/NewStaffForm';

function AddStaffPage () {
  const [success, setSuccess] = React.useState(false)
  const [name, setName] = React.useState('')
  const [staffType, setStaffType] = React.useState('')

  const successFunction = (user_name, staff_type) => {
    setSuccess(true)
    setName(user_name)
    setStaffType(staff_type)
  }
  return <>
    <NewStaffForm onSuccess={successFunction}></NewStaffForm>
    <br></br>
    {success === true
      ? <div>Successfully registered: {name} as {staffType} staff</div>
      : null
    }
  </>
}

export default AddStaffPage;
