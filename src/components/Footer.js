import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DataStates } from '../values/data-states';
import { Typography } from '@material-ui/core';
import ResponsiveGrid from './ResponsiveGrid';

class Footer extends Component {

    render() {

        const stats = (
            <Typography variant="body1">
                Items:
                { this.props.completed } complete / { this.props.total } total ({ Math.round(100 * (this.props.total == 0 ? 1 : this.props.completed / this.props.total ))}%)
            </Typography>
        )

        return (
            <Fragment>
                <ResponsiveGrid style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '32px 16px' }}>
                    <Typography variant="h6" gutterBottom>{ this.props.config.app.title }</Typography>
                    { this.props.itemsLoading ? 'Loading...' : stats }
                </ResponsiveGrid>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const ma = (v, d = []) => v || d
    const itemsLoaded = typeof(state.items) === 'object' && !!state.items.filter
    return {
        itemsLoading: !itemsLoaded, 
        total: itemsLoaded ? ma(state.items).length : 0,
        completed: itemsLoaded ? ma(state.items).filter(i => i.checked).length : 0,
        config: state.config || {}
    }
})(Footer)