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
import { FirstItemWithPropValue } from '../helpers/itemHelper';
import SearchView from '../views/SearchView';
import { DataStates } from '../values/data-states';
import { getAllItems } from '../redux/actions/itemActions';

class ContentRoot extends Component {

    getQueryParams = () => ({ view: 'items', item: null, ...queryString.parse(this.props.location.search) })

    updateSelectedItem = () => {
        let itemId = this.getQueryParams().item
        if ((itemId || ' ')[0] === '@')
            itemId = (FirstItemWithPropValue(this.props.items, 'alias', itemId) || {})._id
        this.props.dispatch({ type: Actions.SelectItem, data: { _id: itemId } })
    }

    componentDidMount() {
        if (this.props.items === DataStates.Unloaded)
            this.props.dispatch(getAllItems())
        this.updateSelectedItem();
    }

    componentDidUpdate() { this.updateSelectedItem(); }

    render() {
        // Because netlify doesn't pass through subdirectory paths, we'll use the query string instead
        // e.x., ?view=items&item=xxxxx...
        // view defaults to "items"
        // item default to null
        const qparams = { view: 'items', item: null, ...queryString.parse(this.props.location.search) }

        const view = !this.props.token ? LoginView : ({
            items: ItemView,
            outline: OutlineView,
            search: SearchView
        }[qparams.view])

        return (<Route path="/" component={view} />)
    }
}

export default connect((state, props) => {
    return {
        items: state.items,
        token: state.userToken
    }
})(withRouter(ContentRoot))