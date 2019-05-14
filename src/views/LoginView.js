import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';
import InitView from './InitView';
import { login } from '../redux/actions/authenticationActions';
import { FormStates } from '../values/form-states';

class LoginView extends Component {

    state = {
        username: this.props.username,
        password: this.props.password,
    }

    handleSubmit = () => {
        this.props.dispatch(login(this.state.username, this.state.password))
    }

    render() {
        return (
            <form action="javascript:;" onSubmit={ this.handleSubmit }>
                Username
                <input type="text" onChange={e => this.setState({username: e.target.value})} />

                Password
                <input type="password" onChange={e => this.setState({password: e.target.value})} />

                <button type="submit"
                    disabled={ this.props.status === FormStates.Submitting ? true : null }
                    >Log In</button>

                <h4>Status</h4>
                { this.props.status === FormStates.Submitting ? 'Submitting...' : 'Ready' }

                <h4>User Token</h4>
                { this.props.userToken }
            </form>
        )
    }

}

export default connect((state, props) => {
    return {
        status: (state.login || {}).status,
        username: (state.login || {}).username,
        password: (state.login || {}).password,
        userToken: state.userToken
    }
})(LoginView)