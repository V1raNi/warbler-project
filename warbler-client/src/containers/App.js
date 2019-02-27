import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store'
import { BrowserRouter as Router } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import Navbar from './Navbar';
import Main from './Main';
import { setAuthorizationToken, setCurrentUser } from '../store/actions/auth';

// create the store
const store = configureStore();

// when the page refreshes (or if our redux store is cleared), if there is a token in localStorage, we add that token to the authorization header in all future requests
// this is the idea of hydration - if the server goes down or if our redux store is cleared we can still see if there is a token in local storage, and if so we can repopulate or rehydrate our state with the current user
if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  // prevent someone from manually tampering with the key of jwtToken in localStorage
  // when we set that token and send it we want to make sure we dispatch with whatever is given to us and handle the case if the token was modified
  try {
    // here we need to decode the payload part of that token into the correct object that we pass to setCurrentUser
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch (err) {
    // if the token is different, we forcibly log the user out
    store.dispatch(setCurrentUser({}));
  }
}

// we can make our App a stateless functional component
const App = () => (
  <Provider store={store}>
    <Router>
      <div className="onboarding">
        <Navbar />
        <Main />
      </div>
    </Router>
  </Provider>
);

export default App;
