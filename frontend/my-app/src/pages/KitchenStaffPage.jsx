import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';
import makeRequest from '../makeRequest';

function KitchenStaffPage() {
  const [orderList, setOrderList] = React.useState([])
  const params = useParams()
  
  const menuId = params.menuId
  const staffId = params.staffId
  console.log(typeof(staffId))
  React.useEffect(() => {
    async function fetchData() {
      await getOrderList();
    }
    fetchData();
  }, []) 

  async function getOrderList() {
    const url = `/kitchen_staff/get_order_list?menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setOrderList(data)
    console.log(data)
  }
  return (
  <>
      <div>Kitchen Staff Page</div>
  </>
  );
}

export default KitchenStaffPage;
