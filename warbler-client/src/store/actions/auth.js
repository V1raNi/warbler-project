import { apiCall, setTokenHeader } from '../../services/api';
import { SET_CURRENT_USER } from '../actionTypes';
import { addError, removeError } from './errors';

// action creator function, this is what we're going to dispatch and send to our reducer
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

// helpful place to isolate our logic so that we can use it in some other places
export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

// when we log in we place a token in localStorage, so logging out is going to be the idea of removing that token
export function logout() {
  return dispatch => {
    localStorage.clear();
    // we pass boolean of false so that we delete that header from all future requests
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  }
}

// function that we're going to run to log in or sign up successfully
// type is signup or signin; userData is some data that is going to come from our request
export function authUser(type, userData) {
  return dispatch => {
    // we still have to wait for our API call to finish before we dispatch an action
    // since we're not using any lifecycle methods, we need another promise to make sure that we wait until the API call has finished before dispatching
    return new Promise((resolve, reject) => {
      // when the call is done, we're going to run a function with some data (we're destructuring it here as token and the rest of the information about user)
      return apiCall('post', `/api/auth/${type}`, userData)
        .then(({token, ...user}) => {
          // if it returns successfully, we're going to set some infromation in the localStorage - this is how we mark a user that's logged in
          // we set a key of jwtToken and a value that we get back - data.token which comes as a response from our server
          localStorage.setItem('jwtToken', token);
          // pass a token which is saved for future requests
          setAuthorizationToken(token);
          // dispatching an action; this is where we're going to go and create that current user in a redux store
          dispatch(setCurrentUser(user));
          dispatch(removeError);
          resolve(); // api call succeded
        })
        .catch(err => {
          dispatch(addError(err.message)); // message is coming from our server error handler
          reject(); // api call failed
        });
    });
  }
}