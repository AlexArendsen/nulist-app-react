import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Routes } from '../values/routes';
import LoginView from '../views/LoginView';
import ItemView from '../views/ItemView';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class ContentRoot extends Component {

    render() {
        return (
            <Grid container spacing={24} style={{ margin: '32px auto' }}>
                <Grid item { ...this.props.config.layout.gutterWidths } />
                <Grid item { ...this.props.config.layout.centerWidths }>
                    <Router>
                        <Route exact path="/" component={LoginView} />
                        <Route exact path={Routes.Login()} component={LoginView} />
                        <Route path={Routes.Items()} component={ItemView} />
                        <Route path={Routes.Item()} component={ItemView} />
                    </Router>
                </Grid>
                <Grid item { ...this.props.config.layout.gutterWidths } />
            </Grid>
        )
    }
}

export default connect((state, props) => {
    return {
        config: state.config || { layout: {} }
    }
})(ContentRoot)