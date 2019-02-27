import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postNewMessage } from '../store/actions/messages';

class MessageForm extends Component {
  constructor(props) {
    super(props);
    // we want to control the input and have some default state for a message
    this.state = {
      message: ''
    };
  }

  handleNewMessage = e => {
    e.preventDefault();
    this.props.postNewMessage(this.state.message);
    this.setState({
      message: ''
    });
    this.props.history.push('/');
  }

  render() {
    return (
      <form onSubmit={this.handleNewMessage}>
        {this.props.errors.message && (
          <div className="alert alert-danger">
            {this.props.errors.message}
          </div>
        )}
        <textarea
          type="text"
          className="form-control"
          value={this.state.message}
          placeholder="Enter your message"
          rows="5"
          // we have only one component so we can omit creating a generic handleChange function
          onChange={e => this.setState({message: e.target.value})}
        />
        <button type="submit" className="btn btn-success pull-right">
          Add my message
        </button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors
  }
}

export default connect(mapStateToProps, { postNewMessage })(MessageForm);
