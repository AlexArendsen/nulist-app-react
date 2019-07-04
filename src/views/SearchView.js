import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { withRouter } from 'react-router';
import ItemList from '../components/ItemList';
import { Routes } from '../values/routes';
import { searchItems } from '../redux/actions/itemActions';

const TokenTypes = {
    Tag: 'TAG',
    Alias: 'ALIAS',
    Title: 'TITLE',
}

const parseQuery = (query) => {
    // TODO -- Make this full-featured, think about moving to reducer
    if (!query) return []

    const withType = (source) => {
        const r = (type) => ({ value: source, type })

        switch(source[0]) {
            case '#': return r(TokenTypes.Tag);
            case '@': return r(TokenTypes.Alias);
            default: return r(TokenTypes.Title);
        }
    }

    const tokens = query.split(' ').filter(x => !!x && x.length).map(withType);
    const take = (type) => tokens.filter(t => t.type === type)
    const m = (v, d = {}) => v || d

    const matchTitle = take(TokenTypes.Title)
        .map(token => new RegExp(token.value, 'i'))
        .map(pattern => ((item) => pattern.test(item.title)))
    const matchTag = take(TokenTypes.Tag)
        .map(token => new RegExp(token.value.slice(1), 'i'))
        .map(pattern => ((item) => pattern.test(m(m(item.props).tags, ''))))
    const matchAlias = take(TokenTypes.Alias)
        .map(token => ((item) => m(m(item.props).alias, '') === token.value))

    const predicates = [ ...matchTitle, ...matchTag, ...matchAlias ]
    console.log('returning preds:', predicates)
    return predicates
}

const itemMatchesPredicates = (item, predicates) => {
    if (!predicates.length) return false;
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
                        enableItemQuickMenu
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