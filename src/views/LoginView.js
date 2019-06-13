import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import InitView from './InitView';
import { login, register } from '../redux/actions/authenticationActions';
import { FormStates } from '../values/form-states';
import { Routes } from '../values/routes';
import { Storage } from '../values/storage';
import { Paper, Typography, TextField, Button, Grid } from '@material-ui/core';
import Recaptcha from 'react-recaptcha';

const Modes = { Login: 'M_LOGIN', Register: 'M_REGISTER' }

const EmptyFields = {
    username: '',
    password: '',
    confirmPassword: ''
}

class LoginView extends Component {

    state = {
        fields: EmptyFields,
        mode: Modes.Login,
        status: FormStates.Ready
    }

    setField = (field, val) => { this.setState({ fields: { ...this.state.fields, [field]: val } }); }

    componentDidMount() {
        // Skip past login if we already know the user
        if (!!localStorage.getItem(Storage.UserTokenKey)) this.props.history.push(Routes.Items())
    }

    handleLogin = async () => {
        this.setState({ status: FormStates.Submitting })
        var success = await this.props.dispatch(login(this.state.fields.username, this.state.fields.password))
        this.setState({ status: FormStates.Ready })
        if (success) this.props.history.push(Routes.Items());
    }

    handleRegister = async () => {
        this.setState({ status: FormStates.Submitting })
        var success = await this.props.dispatch(register(
            this.state.fields.username,
            this.state.fields.password,
            this.state.fields.confirmPassword,
            this.state.recaptcha
        ))
        this.setState({ status: FormStates.Ready, mode: (success) ? Modes.Login : Modes.Register, fields: EmptyFields })
    }

    render() {

        const loginForm = () => {
            return (
                <Fragment>
                    <form action="javascript:;" onSubmit={ this.handleLogin }>

                        <TextField
                            style={{ margin: '8px 0' }}
                            label="Username"
                            fullWidth
                            value={ this.state.fields.username }
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            onChange={e => this.setField('username', e.target.value)} />

                        <TextField
                            style={{ margin: '8px 0' }}
                            type="password"
                            label="Password"
                            fullWidth
                            value={ this.state.fields.password }
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            onChange={e => this.setField('password', e.target.value)} />

                        <Button
                            style={{ margin: '8px 0' }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            >
                            Log In
                        </Button>
                    </form>

                        <Typography variant="body1" align="center" style={{ marginTop: '32px' }}>Need an account?</Typography>
                        <Button
                            type="button"
                            variant="link"
                            onClick={ e => this.setState({ mode: Modes.Register, fields: EmptyFields }) }
                            fullWidth>
                            Click Here To Register
                        </Button>

                </Fragment>
            )
        }

        const registerForm = () => {
            return (
                <Fragment>

                    <form action="javascript:;" onSubmit={ this.handleRegister }>

                        <TextField
                            style={{ margin: '8px 0' }}
                            label="Username"
                            fullWidth
                            value={ this.state.fields.username }
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            onChange={e => this.setField('username', e.target.value)} />

                        <TextField
                            style={{ margin: '8px 0' }}
                            type="password"
                            label="Password"
                            fullWidth
                            value={ this.state.fields.password }
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            onChange={e => this.setField('password', e.target.value)} />

                        <TextField
                            style={{ margin: '8px 0' }}
                            type="password"
                            label="Confirm Password"
                            fullWidth
                            value={ this.state.fields.confirmPassword }
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            onChange={e => this.setField('confirmPassword', e.target.value)} />

                        <Recaptcha
                            sitekey="6LeKlqgUAAAAAKdlaMmt2sYbJivxNNItktCRMEro"
                            render="explicit"
                            verifyCallback={ token => this.setState({ recaptcha: token }) }
                            onloadCallback={ () => console.log('Loaded') }
                            />

                        <Button
                            style={{ margin: '8px 0' }}
                            type="submit"
                            variant="contained"
                            color="secondary"
                            fullWidth
                            disabled={ this.state.status === FormStates.Submitting ? true : null }
                            >
                            Register
                        </Button>

                    </form>

                        <Typography variant="body1" align="center" style={{ marginTop: '32px' }}>Already have an account?</Typography>
                        <Button
                            type="button"
                            variant="link"
                            onClick={ e => this.setState({ mode: Modes.Login, fields: {} }) }
                            fullWidth
                            >
                            Click Here To Login
                        </Button>

                </Fragment>
            )
        }

        return (

            <Grid container>
                <Grid child xs={ 0 } sm={ 0 } md={ 3 }></Grid>
                <Grid child xs={ 12 } sm={ 12 } md={ 6 }>

                    <Paper style={{ padding: '24px' }}>
                        <Typography variant="h4">NuList</Typography>

                        {{
                            [Modes.Login]: (loginForm()),
                            [Modes.Register]: (registerForm())
                        }[this.state.mode]}

                    </Paper>

                </Grid>
                <Grid child xs={ 0 } sm={ 0 } md={ 3 }></Grid>
            </Grid>


        )
    }

}

export default connect((state, props) => {
    return {
        userToken: state.userToken,
        history: props.history
    }
})(LoginView)