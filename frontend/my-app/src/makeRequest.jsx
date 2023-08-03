/**
 * The port number of the backend server.
 * @type {number}
 */
const BACKEND_PORT = 8880;

/**
 * Makes an HTTP request to the backend server using the provided route, method, body, and staff ID (if applicable).
 *
 * @param {string} route - The route of the API endpoint to which the request is made.
 * @param {string} method - The HTTP method for the request (e.g., GET, POST, PUT, DELETE).
 * @param {Object} body - The request body data to be sent in JSON format (optional).
 * @param {string|undefined} staff_id - The staff ID (optional) to be included in the request headers for authentication purposes.
 * @returns {Promise<Object>} A Promise that resolves to the parsed JSON response data from the backend server.
 * @throws {Error} If the response status code indicates an error (4xx or 5xx range), an error will be thrown.
 */
const makeRequest = async (route, method, body, staff_id) => {
  let options = {};

  if (staff_id !== undefined) {
    options = {
      method,
      headers: {
        'Content-type': 'application/json',
        'Authorization': staff_id, // Add staff ID to the request headers for authentication (if provided)
      },
    };
  } else {
    options = {
      method,
      headers: {
        'Content-type': 'application/json',
      },
    };
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch('http://localhost:' + BACKEND_PORT + route, options);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    // 4xx or 5xx range errors
    console.error('There was an error:', data.error);
    alert(`An error occurred:${data.error}`);
    throw new Error(data.error);
  }
};

export default makeRequest;
