import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import InitView from './InitView';
import { login } from '../redux/actions/authenticationActions';
import { FormStates } from '../values/form-states';
import { Routes } from '../values/routes';
import { Storage } from '../values/storage';
import { Paper, Typography, TextField, Button, Grid } from '@material-ui/core';

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

            <Grid container>
                <Grid child xs={ 0 } sm={ 0 } md={ 3 }></Grid>
                <Grid child xs={ 12 } sm={ 12 } md={ 6 }>

                    <Paper style={{ padding: '24px' }}>
                        <Typography variant="h4">NuList</Typography>

                        <form action="javascript:;" onSubmit={ this.handleSubmit }>

                            <TextField
                                style={{ margin: '8px 0' }}
                                label="Username"
                                fullWidth
                                disabled={ this.props.status === FormStates.Submitting ? true : null }
                                onChange={e => this.setState({username: e.target.value})} />

                            <TextField
                                style={{ margin: '8px 0' }}
                                type="password"
                                label="Password"
                                fullWidth
                                disabled={ this.props.status === FormStates.Submitting ? true : null }
                                onChange={e => this.setState({password: e.target.value})} />

                            <Button
                                style={{ margin: '8px 0' }}
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={ this.props.status === FormStates.Submitting ? true : null }
                                >
                                Log In
                            </Button>

                        </form>

                    </Paper>

                </Grid>
                <Grid child xs={ 0 } sm={ 0 } md={ 3 }></Grid>
            </Grid>


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