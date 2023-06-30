import React from 'react';
import '../App.css';
import NewStaffForm from '../components/NewStaffForm';
import { useNavigate } from 'react-router-dom';

function AddStaffPage () {
  const [success, setSuccess] = React.useState(false)
  const [name, setName] = React.useState('')
  const [staffType, setStaffType] = React.useState('')
  const navigate = useNavigate();

  const menuId = localStorage.getItem('menu_id')
  const successFunction = (user_name, staff_type) => {
    setSuccess(true)
    setName(user_name)
    setStaffType(staff_type)
    // navigate(`/manager/menu/${menuId}`)
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
