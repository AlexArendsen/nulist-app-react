import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

class HeaderBar extends Component {
    render() {
        return (
            <Fragment>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="h6">
                            NuList
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {}
})(HeaderBar)