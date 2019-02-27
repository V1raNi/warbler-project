import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_MESSAGES, REMOVE_MESSAGE } from '../actionTypes';

export const loadMessages = messages => ({
  type: LOAD_MESSAGES,
  messages
});

// remove a message
export const remove = id => ({
  type: REMOVE_MESSAGE,
  id
});

export const removeMessage = (user_id, message_id) => {
  return dispatch => {
    return apiCall('delete', `/api/users/${user_id}/messages/${message_id}`)
      .then(() => dispatch(remove(message_id)))
      .catch(err => dispatch(addError(err.message)));
  }
}

// load messages from our db
export const fetchMessages = () => {
  return dispatch => {
    return apiCall('get', '/api/messages')
      .then(res => dispatch(loadMessages(res)))
      .catch(err => addError(err.message)); 
  }
}

// new message; we're going to dispatch and we're also going to be able to get the redux the redux state as the second paramete
export const postNewMessage = text => (dispatch, getState) => {
  // we want to get the current user's id, so we destructure current user from getState, this will give us the redux state (specifically a current user)
  let { currentUser } = getState();
  const id = currentUser.user.id;
  // request to api, add the message to the db, then we're going to reload the message list and then loadMessages is going to run again, and it's going to get the newest message (so we don't really need to worry about adding a new message in our reducer because loadMessages is going to do that for us)
  return apiCall('post', `/api/users/${id}/messages`, { text })
    .then(res => {})
    .catch(err => dispatch(addError(err.message)));
};
