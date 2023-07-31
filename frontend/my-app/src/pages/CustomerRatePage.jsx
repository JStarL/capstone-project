import React from 'react';
import '../App.css';
import { Typography, Paper, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import makeRequest from '../makeRequest';
import StarsIcon from '@mui/icons-material/Stars';
import RatingItem from '../components/RatingItem';
import { StyledButton } from './CustomerOrStaff';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function CustomerRatePage(props) {
  const params = useParams();
  const tableId = params.tableNumber;
  const sessionId = params.sessionId;
  const menuId = params.menuId;
  const [orders, setOrders] = React.useState([])

  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      await fetchOrder();
    }
    fetchData();
  }, [])

  async function fetchOrder() {
    const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setOrders(data.menu_items)
    // console.log(data.menu_items)
    return data;
  }

  const handleGoBack = () => {
    navigate(`/customer/${sessionId}/view_order/${menuId}/${tableId}/pay`)
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <StyledButton
          sx={{ position: 'absolute', top: '10vh', left: '15vw', width: 'auto'}}
          onClick={handleGoBack}
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </StyledButton>
        <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="h3" gutterBottom>
          Rate my meal <StarsIcon sx={{ m: 1, fontSize: '4rem', verticalAlign: 'middle'}} />
        </Typography>
      </div>
      <div className='view-order-page' style={{ justifywidth: '100%', alignItems: 'center' }}>
        {orders?.map((order, index) => (
          <RatingItem
            key={index}
            amount={order.amount}
            menu_item_id={order.menu_item_id}
            foodName={order.title}
            foodDescription={order.description}
            foodImage={order.image}
            foodPrice={order.price}
            orderedByPersona={order.persona}
            personas={props.personas}
          >
          </RatingItem>
        ))}
      </div>
    </>
  )
}

export default CustomerRatePage;
