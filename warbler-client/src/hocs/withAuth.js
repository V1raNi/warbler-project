// handle validation to make sure that a user is logged in before they see a component
import React, { Component } from 'react';
import { connect } from 'react-redux'; // we need this to see if the user is authenticated

// withAuth(<>) - that's how hoc is executed
export default function withAuth(ComponentToBeRendered) {
  // that class simply returns another component
  class Authenticate extends Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push('/signin');
      }
    }

    // when component updates because of any kind of a state change (redux or react), we'll see if any of the next props that that component is getting, they're still authenticated
    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.props.history.push('/signin');
      }
    }

    // render that component to be rendered along with any props
    render() {
      return <ComponentToBeRendered {...this.props} />
    }
  }
  
  function mapStateToProps(state) {
    return {
      isAuthenticated: state.currentUser.isAuthenticated
    };
  }
  
  return connect(mapStateToProps)(Authenticate);
}
