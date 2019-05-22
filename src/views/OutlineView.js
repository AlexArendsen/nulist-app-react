import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Views } from '../values/view';
import InitView from './InitView';
import ItemPicker from '../components/ItemPicker';
import { getAllItems } from '../redux/actions/itemActions';
import { DataStates } from '../values/data-states';
import { Routes } from '../values/routes';
import { Paper } from '@material-ui/core';

class OutlineView extends Component {

    componentDidMount() {
        if (!this.props.itemsLoaded) this.props.dispatch(getAllItems())
    }

    render() {
        return (
            <Paper style={{ padding: '32px 0' }}>
                {/*<ItemPicker onItemClick={ i => this.props.history.push(i ? Routes.Item(i._id) : Routes.Items()) } />*/}
                <ItemPicker onSubmit={ i => alert(`You picked ${i.title}`) } />
            </Paper>
        )
    }
}

export default connect((state, props) => {
    const ma = (v) => ((v && v.filter) ? v : []);
    return {
        items: ma(state.items).slice().sort((a, b) => (a.index - b.index)),
        itemsLoaded: state.items !== DataStates.Unloaded
    }
})(withRouter(OutlineView))