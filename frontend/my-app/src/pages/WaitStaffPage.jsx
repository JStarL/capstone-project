import React from 'react';
import '../App.css';
import makeRequest from '../makeRequest.jsx'

function WaitStaffPage() {
  const [orderList, setOrderList] = React.useState([]); 
	const menuId = localStorage.getItem('menu_id');

	React.useEffect(() => {
    fetchOrderList();
  }, []);

	async function fetchOrderList() {
		const url = `/wait_staff/get_order_list?menu_id=${menuId}`;
		const data = await makeRequest(url, 'GET', undefined, undefined);
		setOrderList(data);
		return data; // Return the fetched data
	}

	if (!orderList || !Array.isArray(orderList)) return <>loading...</>;

	return <>
		wait staff page
		{console.log(orderList)}
	</>
}

export default WaitStaffPage;
