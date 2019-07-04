import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { withRouter } from 'react-router';
import ItemList from '../components/ItemList';
import { Routes } from '../values/routes';
import { searchItems } from '../redux/actions/itemActions';

const parseQuery = (query) => {
    // TODO -- Make this full-featured, think about moving to reducer
    if (!query) return []
    const preds = query.split(' ')
        .map(token => new RegExp(token, 'i'))
        .map(pattern => ((item) => pattern.test(item.title)))
    console.log('returngning preds:', preds)
    return preds;
}

const itemMatchesPredicates = (item, predicates) => {
    if (!predicates.length) return false;
    //return predicates.some(p => p(item))
    return predicates.every(p => p(item))
}

class SearchView extends Component {

    state = { query: this.props.searchQuery }

    handleSearch = (e) => {
        this.props.dispatch(searchItems(this.state.query))
        e.preventDefault()
    }

    render() {
        return (
            <Fragment>
                <form action="javascript:;" onSubmit={ this.handleSearch }>
                    <TextField onChange={ e => this.setState({ query: e.target.value }) } />
                    <Button onClick={ this.handleSearch }>Search</Button>
                </form>

                <Typography>
                    Showing { this.props.results.length } of { this.props.resultCount } results.
                </Typography>

                <Paper>
                    <ItemList
                        items={ this.props.results.slice(0, 50) }
                        onItemClick={ i => this.props.history.push(Routes.Item(i._id)) } />
                </Paper>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const predicates = parseQuery(state.searchQuery || '')
    const matches = (state.items.filter && predicates.length) ? state.items.filter(i => itemMatchesPredicates(i, predicates)) : []
    return {
        results: matches.slice(0, 25),
        resultCount: matches.length,
        searchQuery: state.searchQuery
    }
})(withRouter(SearchView))