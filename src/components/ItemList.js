import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Grid, Typography, Checkbox, LinearProgress, Menu, MenuItem } from '@material-ui/core';
import { checkItem, uncheckItem, deleteItem, moveItem } from '../redux/actions/itemActions';
import { Routes } from '../values/routes';
import TimeAgo from 'react-timeago';
import MaterialMarkdown from './MaterialMarkdown';
import { DataStates } from '../values/data-states';
import ItemProgressBar from './ItemProgressBar';
import DeleteDialog from './DeleteDialog';
import MoveDialog from './MoveDialog';

const abbreviatedFormatter = (value, unit, suffix) => { return value + ({
        'second': 's', 'minute': 'm', 'hour': 'h', 'day': 'd', 'week': 'w', 'month': 'mo', 'year': 'y'
    }[unit.replace(/s$/,'')] || '?')}

class ItemList extends Component {

    state = {
        rightClickedItem: null,
        rightClickedItemAnchor: null,
        showDeleteDialog: false,
        showMoveDialog: false,
    }

    handleItemCheck = (e, item) => {
        this.props.dispatch(item.checked ? uncheckItem(item._id) : checkItem(item._id)) 
        e.preventDefault()
    }

    handleItemClick = (item) => {
        this.props.onItemClick(item);
    }

    handleItemRightClick = (event, item) => {
        if (!this.props.enableItemQuickMenu) return;
        this.setState({ rightClickedItem: item, rightClickedItemAnchor: event.target })
        event.preventDefault()
    }

    handleContextMenuClose = () => {
        this.setState({ rightClickedItem: null, rightClickedItemAnchor: null })
    }

    openDeleteDialog = () => { this.setState({ showDeleteDialog: true }) }
    openMoveDialog = () => { this.setState({ showMoveDialog: true }) }

    closeDeleteDialog = () => { this.setState({ showDeleteDialog: false }) }
    closeMoveDialog = () => { this.setState({ showMoveDialog: false }) }

    moveRightClickedTo = (item) => {
        this.props.dispatch(moveItem(this.state.rightClickedItem, item._id));
        this.setState({ rightClickedItemAnchor: null })
    }

    render() {

        const itemDescription = (item) => ( <MaterialMarkdown source={ item.description } /> )

        const noItems = (text = 'No Items') => (
            <div style={{ padding: '64px', textAlign: 'center' }}>
                <Typography variant="h5" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    { text }
                </Typography>
            </div>
        )

        const contextMenu = (
            <Menu
                id="item-context-menu"
                anchorEl={ this.state.rightClickedItemAnchor }
                open={ !!this.state.rightClickedItemAnchor }
                onClose={ this.handleContextMenuClose }
            >
                <MenuItem onClick={ e => this.setState({ showMoveDialog: true, rightClickedItemAnchor: null }) }>Move</MenuItem>
                { this.props.lastItem && <MenuItem onClick={ e => this.moveRightClickedTo(this.props.lastItem) }>Move to "{ this.props.lastItem.title }"</MenuItem> }
                <MenuItem onClick={ e => this.setState({ showDeleteDialog: true, rightClickedItemAnchor: null }) }>Delete</MenuItem>
            </Menu>
        )

        const result = () => {
            switch (this.props.items) {
                case DataStates.Unloaded: return null;
                case DataStates.Loading: return noItems('Loading...');
                default: return (!this.props.items.length) ? noItems() : (
                    <List>
                        { this.props.items.map(c => (
                            <ListItem key={ c._id }
                                button={ c.saving ? null : true }
                                style={{ backgroundColor: (c.saving ? 'rgba(0,0,0,0.05)' : null ) }}
                                onContextMenu={ e => this.handleItemRightClick(e, c) }>
                                <Grid container>
                                    <Grid xs={ 8 } item onClick={ e => this.handleItemClick(c) } >
                                        <Typography variant="caption" style={{ float: 'right', paddingRight: '16px' }}>
                                            { c.created_at && <TimeAgo date={ c.created_at } formatter={ abbreviatedFormatter } /> }
                                        </Typography>
                                        <ListItemText primary={c.title} secondary={ itemDescription(c) } style={{ maxHeight: '80px', overflowY: 'hidden', opacity: (c.saving ? 0.6 : 1) }} />
                                    </Grid>
                                    <Grid xs={ 3 } item>
                                        <ItemProgressBar item={c} />
                                    </Grid>
                                    <Grid xs={ 1 } item>
                                        <ListItemSecondaryAction>
                                            <Checkbox onChange={ e => this.handleItemCheck(e, c) } checked={ c.checked } />
                                        </ListItemSecondaryAction>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        )) }
                    </List>
                )
            }
        }

        return (
            <Fragment>
                <DeleteDialog item={ this.state.rightClickedItem } open={ this.state.showDeleteDialog } onConfirm={ this.closeDeleteDialog } onCancel={ this.closeDeleteDialog } />
                <MoveDialog item={ this.state.rightClickedItem } open={ this.state.showMoveDialog } onConfirm={ this.closeMoveDialog } onCancel={ this.closeMoveDialog } />
                { contextMenu }
                { result() }
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {
        items: props.items,
        lastItem: ((state.lastMovedId !== null && state.items.filter) ? state.items.filter(i => i._id === state.lastMovedId)[0] : null),
        onItemClick: props.onItemClick
    }
})(withRouter(ItemList))