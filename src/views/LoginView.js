import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import InitView from './InitView';
import { login } from '../redux/actions/authenticationActions';
import { FormStates } from '../values/form-states';
import { Routes } from '../values/routes';
import { Storage } from '../values/storage';

class LoginView extends Component {

    state = {
        username: this.props.username,
        password: this.props.password,
    }

    componentDidMount() {
        // Skip past login if we already know the user
        if (!!localStorage.getItem(Storage.UserTokenKey)) this.props.history.push(Routes.Items())
    }

    handleSubmit = async () => {
        var success = await this.props.dispatch(login(this.state.username, this.state.password))
        if (success) this.props.history.push(Routes.Items());
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
        userToken: state.userToken,
        history: props.history
    }
})(LoginView)