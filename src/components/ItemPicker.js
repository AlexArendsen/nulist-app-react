import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography, Button, Grid } from '@material-ui/core';
import { Actions } from '../values/actions';

class ItemPicker extends Component {

    state = { selectedItem: null }

    toggleItemExpand = (item) => { this.props.dispatch({ type: item.expanded ? Actions.CollapseItem : Actions.ExpandItem, data: item }) }

    handleItemClick = (item) => {
        if (this.props.onItemClick) this.props.onItemClick(item)
        this.setState({ selectedItem: item })
    }

    handleSubmit = () => {
        if (this.props.onSubmit) this.props.onSubmit(this.state.selectedItem)
    }

    render() {
        if (!this.props.items || !this.props.items.filter) return null;

        const top = this.props.items.filter(i => !i.parent_id)

        const expando = (item, indent = false) => {
            const children = this.props.items.filter(i => i.parent_id === item._id)
            return (
                <div style={ indent ? { marginLeft: '16px', borderLeft: 'solid 1px rgba(0,0,0,0.05)' } : {}} key={ item._id }>
                    <Typography variant="body2" style={{ backgroundColor: (item._id === (this.state.selectedItem || {})._id) ? 'aliceblue': 'transparent' }} >
                        <Button size="small" onClick={ e => this.toggleItemExpand(item) }>
                            { item.expanded ? "-" : "+" }
                        </Button>
                        <a href="javascript:void(0)" onClick={ e => this.handleItemClick(item) } style={{ textDecoration: 'none', marginLeft: '8px' }}>
                            {item.title} (+{ item.descendants })
                        </a>
                    </Typography>
                    { item.expanded && children.map(c => expando(c, true)) }
                </div>
            )
        }

        const submitSection = (!this.props.onSubmit)
         ? null : (
             <div style={{ padding: '0 32px', marginTop: '32px' }}>
                 <Button onClick={ this.handleSubmit } variant="contained" color="primary" style={{ float: 'left', marginRight: '16px' }}>Submit</Button>
                 <Typography variant="body1" style={{ padding: '7px' }}>
                    Selected: <strong>{ this.state.selectedItem ? this.state.selectedItem.title : '<Root>' }</strong>
                </Typography>
             </div>
         )

        return (
            <Fragment>
                <Typography variant="body1"><strong>All Items</strong></Typography>
                { top.map(e => expando(e, false)) }

                <Typography variant="body1"><strong>Recent Items</strong></Typography>
                { this.props.recent.map(e => expando(e, false)) }

                { submitSection }
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const ma = (v) => ((v && v.filter) ? v : []);
    const m = (v, d = {}) => v || d;

    const recentItems = ma(state.recentItemIds).map(id => ma(state.items).find(i => i._id === id)).filter(i => i && i._id);
    const nameIsAmbiguous = (name) => recentItems.filter(i => i.title === name).length > 1;
    const disambiguatedName = (item) => `${m(state.items.find(i => i._id == item.parent_id), { title: '(Home)' }).title} > ${item.title}`

    return {
        items: ma(state.items).slice().sort((a, b) => (a.index - b.index)),
        recent: recentItems.map(i => nameIsAmbiguous(i.title) ? { ...i, title: disambiguatedName(i) } : i),
        onItemClick: props.onItemClick,
        onSubmit: props.onSubmit
    }
})(ItemPicker)