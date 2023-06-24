// import React from 'react';
// import PropTypes from 'prop-types';

const makeRequest = async (route, method, body, token) => {
  let options = {};
  if (token !== undefined) {
    options = {
      method,
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    }
  } else {
    options = {
      method,
      headers: {
        'Content-type': 'application/json',
      }
    }
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch('http://localhost:5005' + route, options)
  const data = await response.json()
  if (data.error) {
    alert(data.error);
  } else {
    return data
  }
}

export default makeRequest
// makeRequest.propTypes = {
//   route: PropTypes.string,
//   method: PropTypes.string,
//   body: PropTypes.object,
//   token: PropTypes.string
// };
