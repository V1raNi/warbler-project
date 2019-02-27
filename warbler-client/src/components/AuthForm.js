// sign in and sign up component
import React, { Component } from 'react';

export default class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      profileImageUrl: ''
    };
  }

  // we'll use experimental syntax; we use =>, and we don't have to do method binding in the constructor
  handleChange = e => {
    this.setState({
      // computed property name so we can make a generic function for any of our inputs
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    // we figure out what the auth type is (type of request that we're going to make)
    const authType = this.props.signUp ? 'signup' : 'signin';
    this.props.onAuth(authType, this.state)
      .then(() => {
        // redirect a user
        this.props.history.push('/');
      })
      .catch(() => {
        return;
      });
  }

  render() {
    const { email, username, password, profileImageUrl } = this.state;
    // we destructure history which we get from react router (this.props.history)
    const { heading, buttonText, signUp, errors, history, removeError } = this.props;

    // history.listen(() => {
    //   // listens to changes in the route
    //   removeError();
    // });

    if (errors.message) {
      // listens to changes in the route and removes a listener so that it won't stack a pile of listeners
      const unlisten = history.listen(() => {
        removeError();
        unlisten();
      });
    }

    return (
      <div>
        {/* use bootstrap styling to get our form, inputs, and text inside in the center */}
        <div className="row justify-content-md-center text-center">
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit}>
              {/* heading comes from this.props that we pass down from our Main.js */}
              <h2>{heading}</h2>
              {errors.message && (
              <div className="alert alert-danger">
                {errors.message}
              </div>)}
              <label htmlFor="email">Email:</label>
              {/* id for label, name for state, value - in case of error we'll still be able to pre-populate in with whatever email is at the moment */}
              <input
                className="form-control"
                id="email"
                name="email"
                onChange={this.handleChange}
                value={email}
                type="text"
              />
              <label htmlFor="password">Password:</label>
              <input
                className="form-control"
                id="password"
                name="password"
                onChange={this.handleChange}
                type="password"
              />
              {/* if there is a prop of signUp show the rest of HTML; it's 'Inline If with Logical && Operator' */}
              {signUp && (
                <div>
                  <label htmlFor="username">Username:</label>
                  <input
                    className="form-control"
                    id="username"
                    name="username"
                    onChange={this.handleChange}
                    value={username}
                    type="text"
                  />
                  <label htmlFor="image-url">Image URL:</label>
                  <input
                    className="form-control"
                    id="image-url"
                    name="profileImageUrl"
                    onChange={this.handleChange}
                    value={profileImageUrl}
                    type="text"
                  />
                </div>
              )}
              <button className="btn btn-primary btn-block btn-lg" type="submit">
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}