// Routing logic
import React from 'react';
// we need all of these to make sure we're correctly passing props down to our component that can use React Router and that we can specify the current route that we're on as well as redirect when we need to
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Homepage from '../components/Homepage';
import AuthForm from '../components/AuthForm';
import { authUser } from '../store/actions/auth'; // we pass authUser as a prop to our form
import { removeError } from '../store/actions/errors';
import withAuth from '../hocs/withAuth';
import MessageForm from '../containers/MessageForm';

const Main = props => {
  const { authUser, errors, removeError, currentUser } = props;
  return(
    <div className="container">
      <Switch>
        {/* we're rendering a function which renders the homepage component and pass some props (from react router as well) to that component; this is going to be helpful so that our homepage can route as well */}
        <Route exact path="/" render={props => <Homepage currentUser={currentUser} {...props} />} />
        {/* These are dependent on the kind of form that we're rendering (adding some sensible defaults here) */}
        <Route exact path="/signin" render={props => {
          return (
            <AuthForm onAuth={authUser} errors={errors} removeError={removeError} buttonText="Log In" heading="Welcome Back" {...props} />
          );
        }} />
        <Route exact path="/signup" render={props => {
          return (
            <AuthForm signUp onAuth={authUser} errors={errors} removeError={removeError} buttonText="Sign me up!" heading="Join Warbler Today" {...props} />
          );
        }} />
        <Route path="/users/:id/messages/new" component={withAuth(MessageForm)} />
      </Switch>
    </div>
  );
}

// we'll use state to decide if our homepage displays a landing page or a timeline of messages
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errors: state.errors
  }
}

// withRouter allows us to actually get those props from the router to our component
// these components will be able to use history object to redirect and we also connect it with Redux store
// make sure we pass authUser as our mapDispatchToProps
export default withRouter(connect(mapStateToProps, { authUser, removeError })(Main));