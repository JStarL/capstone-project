import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import KitchenStaffOrder from '../components/KitchenStaffOrder';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

/**
 * Represents the KitchenStaffPage component that displays pending orders for kitchen staff.
 * @returns {JSX.Element} The JSX representation of the KitchenStaffPage component.
 */
function KitchenStaffPage() {
  const [orderList, setOrderList] = React.useState([]);
  const [trigger, setTrigger] = React.useState(true);
  const params = useParams();

  const menuId = params.menuId;
  const staffId = params.staffId;

  /**
    * Use Effect hook to fetch orders pending for kitchen staff
    */
  React.useEffect(() => {
    async function fetchData() {
      await getOrderList();
    }

    fetchData();

    // Polling mechanism to fetch order list periodically
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [trigger]);

  /**
   * Fetches the list of pending orders for the kitchen staff.
   */
  async function getOrderList() {
    const url = `/kitchen_staff/get_order_list?menu_id=${menuId}&kitchen_staff_id=${staffId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setOrderList(data);
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1em'}}>
        <PendingActionsIcon style={{fontSize: '2rem', margin: '10px'}} />
        <Typography fontSize='1.5em' variant="overline">
          <b>Pending Orders</b>
        </Typography>
      </div>

      {orderList.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <Typography style={{
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
            borderRadius: '10px',
            padding: '1vw',
            width: 'auto',
            marginLeft: '10px',
            textAlign: 'center', // Center the text horizontally
          }} variant="overline" gutterBottom>No Pending orders at the moment</Typography>
        </div>
      ) : (
        orderList.map((order, index) => (
          <KitchenStaffOrder
            key={index}
            status={order.status}
            timestamp={order.timestamp}
            tableId={order.table_id}
            menuItems={order.menu_items}
            sessionId={order.session_id}
            trigger={trigger}
            setTrigger={setTrigger}
            staffId={staffId}
            menuId={menuId}
          />
        ))
      )}
    </>
  );
}

export default KitchenStaffPage;
