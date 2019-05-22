import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Routes } from '../values/routes';
import LoginView from '../views/LoginView';
import ItemView from '../views/ItemView';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ResponsiveGrid from './ResponsiveGrid';
import OutlineView from '../views/OutlineView';

class ContentRoot extends Component {

    render() {
        const authenticatedRoutes = (
            <Fragment>
                <Route exact path="/" component={ItemView} />
                <Route exact path={Routes.Items()} component={ItemView} />
                <Route path={Routes.Item()} component={ItemView} />
                <Route exact path={Routes.Outline()} component={OutlineView} />
            </Fragment>
        )

        const unauthenticatedRoutes = (
            <Fragment>
                <Route path="/" component={LoginView} />
            </Fragment>
        )


        return (
            <ResponsiveGrid style={{ margin: '32px auto' }}>
                <Router>
                    { (this.props.token ? authenticatedRoutes : unauthenticatedRoutes ) }
                </Router>
            </ResponsiveGrid>
        )
    }
}

export default connect((state, props) => {
    return {
        token: state.userToken
    }
})(ContentRoot)