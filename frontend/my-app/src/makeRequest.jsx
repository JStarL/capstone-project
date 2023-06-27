// import React from 'react';
// import PropTypes from 'prop-types';
// const configData = require('../config.json');
const BACKEND_PORT = 8080;
const BACKEND_BASE_URL = 'http://localhost:' + BACKEND_PORT;

export const fetchFromBackend = (subUrl, methodType, reqBody, token) => {
  return new Promise((resolve, reject) => {
    const reqHeaders = new Headers();

    reqHeaders.set('accept', 'application/json');

    if (reqBody !== undefined) {
      reqHeaders.set('Content-Type', 'application/json');
    }

    if (!(subUrl.startsWith('/admin/auth/register') || subUrl.startsWith('/admin/auth/login'))) {
      reqHeaders.set('Authorization', 'Bearer ' + token);
    }

    fetch(BACKEND_BASE_URL + subUrl, {
      method: methodType,
      headers: reqHeaders,
      body: JSON.stringify(reqBody)
    })
      .then(res => res.json())
      .then(val => resolve(val))
      .catch(err => reject(err));
  })
};


const makeRequest = async (route, method, body, staff_id) => {
  let options = {};
  if (staff_id !== undefined) {
    options = {
      method,
      headers: {
        'Content-type': 'application/json',
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
  const response = await fetch('http://localhost:8880' + route, options)
  const data = await response.json()
  if (data.error) {
    alert(data.error);
  } else {
    console.log(data)
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
