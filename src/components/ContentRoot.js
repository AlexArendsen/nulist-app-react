import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Routes } from '../values/routes';
import LoginView from '../views/LoginView';
import ItemView from '../views/ItemView';
import { Route, withRouter } from 'react-router-dom';
import ResponsiveGrid from './ResponsiveGrid';
import OutlineView from '../views/OutlineView';
import queryString from 'query-string';
import { Actions } from '../values/actions';

class ContentRoot extends Component {

    getQueryParams = () => ({ view: 'items', item: null, ...queryString.parse(this.props.location.search) })

    updateSelectedItem = () => { this.props.dispatch({ type: Actions.SelectItem, data: { _id: this.getQueryParams().item } }) }

    componentDidMount() { this.updateSelectedItem(); }

    componentDidUpdate() { this.updateSelectedItem(); }

    render() {
        // Because netlify doesn't pass through subdirectory paths, we'll use the query string instead
        // e.x., ?view=items&item=xxxxx...
        // view defaults to "items"
        // item default to null
        const qparams = { view: 'items', item: null, ...queryString.parse(this.props.location.search) }

        const view = ({
            items: ItemView,
            outline: OutlineView
        }[qparams.view])

        return(
            <Route exact path="/" component={view} />
        )
    }
}

export default connect((state, props) => {
    return {
        token: state.userToken
    }
})(withRouter(ContentRoot))