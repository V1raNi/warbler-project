import rootReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// function that creates the store
export function configureStore() {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  return store;
}