import { ADD_ERROR, REMOVE_ERROR } from '../actionTypes';


// export some kind of default state (as a default param) which we can initialize as an object with message: null (assuming there's no error message to start)
export default (state = {message: null}, action) => {
  // we switch based off the action type, making it a generic error handler
  switch(action.type) {
    case ADD_ERROR:
      return {...state, message: action.error };
    case REMOVE_ERROR:
      return {...state, message: null };
    default:
      return state
  }
};