import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';
import ResponsiveGrid from './ResponsiveGrid';
import { DataStates } from '../values/data-states';
import { Routes } from '../values/routes';
import { loadProfileInfo } from '../redux/actions/profileActions';

class HeaderBar extends Component {

    componentDidMount() {
        if (this.props.profileUnloaded) this.props.dispatch(loadProfileInfo())
    }

    render() {

        const profileButton = () => {
            switch(this.props.profile) {
                case DataStates.Unloaded: return null;
                case DataStates.Loading: return (<Typography variant="button">Loading...</Typography>)
                case DataStates.Error: return (<Typography variant="button">Loading Error</Typography>)
                default: return (
                    <Button variant="text">
                        { this.props.profile.username }
                        <Avatar style={{ marginLeft: '16px', width: '32px', height: '32px' }}>{ this.props.profile.username[0] }</Avatar>
                    </Button>
                )
            }
        }

        return (
            <Fragment>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <ResponsiveGrid>
                            <div style={{ float: 'right' }}>
                                { profileButton() }
                            </div>
                            <Typography variant="h6" style={{ flexGrow: 1 }} >NuList</Typography>
                        </ResponsiveGrid>
                    </Toolbar>
                </AppBar>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {
        profile: state.profile,
        profileUnloaded: state.profile === DataStates.Unloaded
     }
})(HeaderBar)