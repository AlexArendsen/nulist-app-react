import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Grid, Typography, Checkbox, LinearProgress } from '@material-ui/core';
import { checkItem, uncheckItem } from '../redux/actions/itemActions';
import { Routes } from '../values/routes';
import TimeAgo from 'react-timeago';
import MaterialMarkdown from './MaterialMarkdown';
import { DataStates } from '../values/data-states';

const abbreviatedFormatter = (value, unit, suffix) => { return value + ({
        'second': 's', 'minute': 'm', 'hour': 'h', 'day': 'd', 'week': 'w', 'month': 'mo', 'year': 'y'
    }[unit.replace(/s$/,'')] || '?')}

class ItemList extends Component {

    handleItemCheck = (e, item) => {
        this.props.dispatch(item.checked ? uncheckItem(item._id) : checkItem(item._id)) 
        e.preventDefault()
    }

    handleItemClick = (item) => {
        this.props.onItemClick(item);
    }

    render() {

        const itemFraction = (item) => `${item.completed} / ${item.descendants}`
        const itemCompletePercent = (item) => Math.round(item.checked ? 100 : (item.descendants ? 100*(item.completed / item.descendants) : 0 ));
        const itemDescription = (item) => ( <MaterialMarkdown source={ item.description } /> )

        const noItems = (text = 'No Items') => (
            <div style={{ padding: '64px', textAlign: 'center' }}>
                <Typography variant="h5" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    { text }
                </Typography>
            </div>
        )

        const result = () => {
            if (this.props.items && !this.props.items.length) return noItems()
            switch (this.props.items) {
                case DataStates.Unloaded: return null;
                case DataStates.Loading: return noItems('Loading...');
                default: return (
                    <List>
                        { this.props.items.map(c => (
                            <ListItem key={ c._id } button={ c.saving ? null : true } style={{ backgroundColor: (c.saving ? 'rgba(0,0,0,0.05)' : null ) }}>
                                <Grid container>
                                    <Grid xs={ 8 } item onClick={ e => this.handleItemClick(c) }>
                                        <Typography variant="caption" style={{ float: 'right', paddingRight: '16px' }}>
                                            { c.created_at && <TimeAgo date={ c.created_at } formatter={ abbreviatedFormatter } /> }
                                        </Typography>
                                        <ListItemText primary={c.title} secondary={ itemDescription(c) } style={{ maxHeight: '80px', overflowY: 'hidden', opacity: (c.saving ? 0.6 : 1) }} />
                                    </Grid>
                                    <Grid xs={ 3 } item>
                                        <LinearProgress value={ itemCompletePercent(c) } variant={ c.saving ? 'indeterminate' : 'determinate' } style={{ height: '8px' }} />
                                        <Typography variant="caption">{ itemFraction(c) } &middot; { itemCompletePercent(c) }%</Typography>
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

        return result()
    }
}

export default connect((state, props) => {
    return {
        items: props.items,
        onItemClick: props.onItemClick
    }
})(withRouter(ItemList))