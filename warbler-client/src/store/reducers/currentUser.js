import { SET_CURRENT_USER } from '../actionTypes';

const DEFAULT_STATE = {
  isAuthenticated: false, // hopefully be true when logged in
  user: {}, // all the user info when they logged in
};

// log out will be the same - we just pass an empty object, that way we don't need another entire action type
export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      // in JS there is no easy way to figure out from a boolean standpoint if the object has or doesn't have any keys
      return {
        // if the user is authenticated, there would be more that one key inside which means length is going to be > 0 (we can use length > 0)
        // we can use !! as well, it will turn empty object into false, or if there are keys, true; !! - converting something into a boolean and 0 is falsey (same as Boolean(Object.keys...))
        isAuthenticated: !!Object.keys(action.user).length,
        user: action.user
      };
    default:
      return state;
  }
}