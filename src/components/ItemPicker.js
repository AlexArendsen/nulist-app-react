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

        const expando = (item) => {
            const children = this.props.items.filter(i => i.parent_id === item._id)
            return (
                <div style={{ marginLeft: '16px', borderLeft: 'solid 1px rgba(0,0,0,0.05)' }} key={ item._id }>
                    <Typography variant="body2" >
                        <Button size="small" onClick={ e => this.toggleItemExpand(item) }>
                            { item.expanded ? "-" : "+" }
                        </Button>
                        <a href="javascript:void(0)" onClick={ e => this.handleItemClick(item) } style={{ textDecoration: 'none', marginLeft: '8px' }}>
                            {item.title} (+{ item.descendants })
                        </a>
                    </Typography>
                    { item.expanded && children.map(c => expando(c)) }
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
                { top.map(expando) }
                { submitSection }
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const ma = (v) => ((v && v.filter) ? v : []);
    return {
        items: ma(state.items).slice().sort((a, b) => (a.index - b.index)),
        onItemClick: props.onItemClick,
        onSubmit: props.onSubmit
    }
})(ItemPicker)