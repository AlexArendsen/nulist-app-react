import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DeleteOperations } from '../values/delete-operations';
import SimpleRadioSelection from './SimpleRadioSelection';
import ChoiceDialog from './ChoiceDialog';
import { deleteItem, deleteManyItems } from '../redux/actions/itemActions';

class DeleteDialog extends Component {

    state = {
        operation: DeleteOperations.Self
    }

    handleCancel = () => { this.props.onCancel() }

    handleConfirm = (operation) => {
        switch (operation) {
            case DeleteOperations.Self: this.props.dispatch(deleteItem(this.props.item._id)); break;
            case DeleteOperations.AllComplete: this.props.dispatch(deleteManyItems(this.props.children.filter(c => c.checked).map(c => c._id))); break;
            case DeleteOperations.AllIncomplete: this.props.dispatch(deleteManyItems(this.props.children.filter(c => !c.checked).map(c => c._id))); break;
        }
        this.props.onConfirm({ operation, item: this.props.item })
    }

    render() {
        return !this.props.item ? null : (
            <ChoiceDialog
                open={ this.props.open }
                title='Confirm Delete'
                choices={[
                    { label: `Delete ${this.props.item.title}`, value: DeleteOperations.Self },
                    { label: `Delete ${this.props.children.filter(c => c.checked).length} complete child item(s)`, value: DeleteOperations.AllComplete },
                    { label: `Delete ${this.props.children.filter(c => !c.checked).length} incomplete child item(s)`, value: DeleteOperations.AllIncomplete },
                ]}
                onSubmit={ this.handleConfirm }
                onCancel={ this.handleCancel } />
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
})(DeleteDialog)