import { LOAD_MESSAGES, REMOVE_MESSAGE } from '../actionTypes';

const message = (state = [], action) => {
  switch (action.type) {
    case LOAD_MESSAGES:
      return [...action.messages];
    case REMOVE_MESSAGE:
      // we return all of the messages except for the one that's been removed with a pure function and then loadMessages will show us them
      return state.filter(message => message._id !== action.id);
    default:
      return state;
  }
}

export default message;