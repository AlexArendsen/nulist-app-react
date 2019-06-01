import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';
import { withRouter } from 'react-router';
import InitView from './InitView';
import { getAllItems, selectItem, goUp, addItem, uncheckItem, checkItem } from '../redux/actions/itemActions';
import { Link } from 'react-router-dom';
import { Routes } from '../values/routes';
import { Typography, List, ListItem, Grid, ListItemText, ListItemSecondaryAction, Checkbox, Card, CardContent, TextField, Button, LinearProgress, Paper } from '@material-ui/core';
import { DataStates } from '../values/data-states';
import ItemBreadcrumbTrail from '../components/ItemBreadcrumbTrail';
import ItemList from '../components/ItemList';
import ItemDetailsCard from '../components/ItemDetailsCard';
import { loadProfileInfo } from '../redux/actions/profileActions';

class ItemView extends Component {

    state = { newItemName: '' }

    componentDidMount() {
        if (!this.props.itemsLoaded) this.props.dispatch(getAllItems())
    }

    handleClickUp = () => {
        this.props.history.push(this.props.item.parent_id ? Routes.Item(this.props.item.parent_id) : Routes.Items())
    }

    handleItemClick = (item) => { this.props.history.push(Routes.Item(item._id)) }

    handleAddItem = () => {
        this.props.dispatch(addItem(this.state.newItemName, (this.props.item || {_id: null})._id))
        this.setState({ newItemName: '' })
    }

    goHome = () => { this.props.history.push(Routes.Items()); }

    render() {

        const itemForm = (
            <form action="javascript:void(0)" style={{ width: '100%', padding: '8px 0' }}>

                <Grid container spacing={ 8 }>
                    <Grid xs={ 2 } item></Grid>
                    <Grid xs={ 6 } item>
                        <TextField label="Add A New Item"
                            value={ this.state.newItemName }
                            variant="outlined"
                            margin="dense"
                            fullWidth={ true }
                            onChange={ e => this.setState({ newItemName: e.target.value }) } />
                    </Grid>
                    <Grid xs={ 2 } item>
                        <Button variant="contained"
                            onClick={ this.handleAddItem }
                            type="submit"
                            color="primary"
                            style={{ padding: '12px 0', marginTop: '8px', marginBottom: '4px' }}
                            fullWidth={ true }>
                                Add
                        </Button>
                    </Grid>
                    <Grid xs={ 2 } item></Grid>
                </Grid>

            </form>
        )

        const recentItems = (
            <Fragment>
                <Typography variant="h6" style={{ marginTop: '32px' }}>Recent Items</Typography>
                <Paper>
                    <ItemList items={ this.props.recentItems } onItemClick={ this.handleItemClick } />
                </Paper>
            </Fragment>
        )

        return (
            <Fragment>

                <div style={{ marginBottom: '8px' }}>

                    { this.props.item && (
                        <Fragment>
                            <Button onClick={ this.handleClickUp } size="small">Up</Button> |
                        </Fragment>
                    ) }

                    <ItemBreadcrumbTrail item={ this.props.item } onItemClick={ this.handleItemClick } onHomeClick={ this.goHome } />
                </div>

                { ( this.props.item ) ? (<ItemDetailsCard item={ this.props.item } />) : undefined }

                <Paper style={{ marginTop: '32px' }}>
                    { itemForm }
                    <ItemList items={ this.props.children } onItemClick={ this.handleItemClick } />
                </Paper>

                { this.props.recentItems && recentItems }

            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const m = (v, d = {}) => v || d;
    const itemId = m(m(props.match).params).itemId || null
    const itemsLoaded = m(state.items).find
    const children = itemsLoaded
        ? state.items.filter(i => i.parent_id === itemId).slice().sort((a, b) => (a.index - b.index))
        : state.items;
    return {
        children, itemsLoaded,
        recentItems: (!itemId) ? state.recentItemIds.map(id => state.items.find(i => i._id === id)).filter(i => i && i._id) : null,
        item: itemsLoaded ? (state.items.find(i => i._id === itemId)) || null : null,
    }
})(withRouter(ItemView))