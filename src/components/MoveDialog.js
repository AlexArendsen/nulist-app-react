import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ChoiceDialog from './ChoiceDialog';
import ItemPicker from './ItemPicker';
import { MoveOperations } from '../values/move-operations';
import { moveManyItems, moveItem } from '../redux/actions/itemActions';
import { Typography } from '@material-ui/core';

class MoveDialog extends Component {

    state = {
        newParent: null
    }

    handleConfirm = (operation) => {
        const parentId = (this.state.newParent || {})._id;
        switch (operation) {
            case MoveOperations.Self: this.props.dispatch(moveItem(this.props.item, parentId)); break;
            case MoveOperations.All: this.props.dispatch(moveManyItems(this.props.children.map(c => c._id), parentId)); break;
            case MoveOperations.AllComplete: this.props.dispatch(moveManyItems(this.props.children.filter(c => c.checked).map(i => i._id), parentId)); break;
            case MoveOperations.AllIncomplete: this.props.dispatch(moveManyItems(this.props.children.filter(c => !c.checked).map(i => i._id), parentId)); break;
        }
        this.props.onConfirm({ operation: operation, item: this.props.item })
    }

    handleCancel = () => { this.props.onCancel() }

    render() {
        return !(this.props.item) ? null : (
            <ChoiceDialog
                title='Confirm Move'
                open={ this.props.open }
                choices={[
                    { label: `Move ${this.props.item.title}`, value: MoveOperations.Self },
                    { label: `Move all ${this.props.children.length} child items`, value: MoveOperations.All },
                    { label: `Move ${this.props.children.filter(c => c.checked).length} complete child item(s)`, value: MoveOperations.AllComplete },
                    { label: `Move ${this.props.children.filter(c => !c.checked).length} incomplete child item(s)`, value: MoveOperations.AllIncomplete },
                ]}
                onCancel={ this.handleCancel }
                onSubmit={ this.handleConfirm }
                >
                <hr />
                <Typography variant="h6">Choose New Parent</Typography>
                <ItemPicker onItemClick={ i => this.setState({ newParent: i }) } />
            </ChoiceDialog>
        )
    }
}

export default connect((state, props) => {
    if (!props.item) return { }
    return {
        item: props.item,
        children: state.items.filter(i => i.parent_id === props.item._id),
        open: props.open,
        onConfirm: props.onConfirm,
        onCancel: props.onCancel
    }
})(MoveDialog)