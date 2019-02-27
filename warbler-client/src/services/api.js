// requests to our server
import axios from 'axios';

// we set the default header which is going to be attached to our future requests when the user logs in
export function setTokenHeader(token) {
  if (token) {
    // attach the token to mark us as loged in
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // when logs out
    delete axios.defaults.headers.common['Authorization'];
  }
}

// method - http verb; path - endpoint, data (optional) - data in sjon for post requests
export function apiCall(method, path, data) {
  // it will return a promise, so we're going to resolve that promise when our actions are resolved
  return new Promise((resolve, reject) => {
    // we return axios request with whatever method we pass in; we can't use dot notation to access a key in an object, we have to use bracket notation because we need to evaluate whatever the value of method is; this will return a function so we invoke it with 'path' and 'data'
    return axios[method.toLowerCase()](path, data)
      .then(res => {
        // with successful request we get back some object of data, so we're taking the data that we get back from axios and turning it into an object we can easily work with
        return resolve(res.data);
      })
      .catch(err => {
        // when we get information from axios it always comes in in a certain object; in this case it's 'response' and subobject 'data', and inside of 'data' there's subobject 'error' which is what we're senging from our server as the error handler that we built
        return reject(err.response.data.error);
      });
  });
}