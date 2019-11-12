import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Paper, Typography, Grid } from '@material-ui/core';
import ItemList from './ItemList';
import ItemProgressBar from './ItemProgressBar';
import TimeAgo from 'react-timeago';

const abbreviatedFormatter = (value, unit, suffix) => { return value + ({
        'second': 's', 'minute': 'm', 'hour': 'h', 'day': 'd', 'week': 'w', 'month': 'mo', 'year': 'y'
    }[unit.replace(/s$/,'')] || '?')}

class ItemGroup extends Component {

    render() {
        const { item, children, onItemClick } = this.props;
        return (
            <Fragment>
                <Grid style={{ marginTop: '24px' }} container>
                    <Grid xs={ 8 } item>
                        <Typography variant="caption" style={{ float: 'right', paddingRight: '16px' }}>
                            { item.created_at && <TimeAgo date={ item.created_at } formatter={ abbreviatedFormatter } /> }
                        </Typography>
                        <Typography variant="h6" onClick={ e => onItemClick(item) }>{ item.title }</Typography>
                    </Grid>
                    <Grid xs={ 4 } item>
                        <ItemProgressBar item={item} />
                    </Grid>
                </Grid>
                <Paper>
                    <ItemList items={ children } onItemClick={ onItemClick } />
                </Paper>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const { onItemClick, sortItems = ((list) => list.sort((a, b) => a.index - b.index)) } = props;
    const m = (v, d = {}) => v || d;

    const itemId = props.item._id
    const itemsLoaded = m(state.items).find
    const item = itemsLoaded ? (state.items.find(i => i._id === itemId)) || null : null

    const children = itemsLoaded ? sortItems(state.items.filter(i => i.parent_id === itemId).slice()) : []

    return { item, children, onItemClick, sortItems }
})(withRouter(ItemGroup))