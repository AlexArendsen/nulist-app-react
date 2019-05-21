import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { deleteItem, updateItem } from '../redux/actions/itemActions';
import { Routes } from '../values/routes';
import MaterialMarkdown from './MaterialMarkdown';

const Modes = { Viewing: 'MODE_VIEW', Editing: 'MODE_EDIT' }

class ItemDetailsCard extends Component {

    state = {
        showDeleteDialog: false,
        mode: Modes.Viewing,
        fields: {
            description: null,
            title: null
        },
        itemId: null
    }

    componentDidMount() {
        if (!!this.props.item) this.setState({ itemDescription: this.props.item.description })
    }

    componentDidUpdate() {
        // Kind of hacky, but close editor when navigated to a different item-- leaving it open
        // leads to all sort of state woes
        if (this.state.itemId !== this.props.item._id) this.setState({
            mode: Modes.Viewing,
            itemId: this.props.item._id,
            itemDescription: this.props.item.description
        })
    }

    openDeleteDialog = () => { this.setState({ showDeleteDialog: true }) }
    onConfirmDelete = () => {
        this.props.history.push(Routes.Item(this.props.item.parent_id));
        this.props.dispatch(deleteItem(this.props.item._id))
        this.setState({ showDeleteDialog: false })
    }
    onCancelDelete = () => { this.setState({ showDeleteDialog: false }) }

    editOrSave = () => {
        if (this.state.mode === Modes.Editing) {
            const changedFields = Object.keys(this.state.fields)
                .filter(k => !!this.state.fields[k])
                .reduce((obj, next) => ({ ...obj, [next]: this.state.fields[next] }), {})
            this.props.dispatch(updateItem({ ...this.props.item, ...changedFields }))
        }
        this.setState({
            mode: this.state.mode == Modes.Viewing ? Modes.Editing : Modes.Viewing
        })
    }

    discard = () => { this.setState({ mode: Modes.Viewing }) }

    render() {

        const disablableButton = (title, onClick = (() => {}), isPrimary = false) => (
            <Button
                disabled={ this.props.item.saving ? true : null }
                variant={ isPrimary ? "contained" : "link" }
                color={ isPrimary ? "primary" : "default" }
                onClick={ onClick }>
                    { title }
            </Button>)
        const content = (this.state.mode == Modes.Viewing) ? (<MaterialMarkdown source={ this.props.item.description } />)
         : (
             <TextField
                onChange={ e => this.setState({ fields: { ...this.state.fields, description: e.target.value }}) }
                defaultValue={ this.props.item.description }
                label="Description"
                variant="outlined"
                rows="12"
                fullWidth
                multiline />
         )

        return (
            <Fragment>

                <Dialog
                    onClose={ this.handleClose }
                    open={ this.state.showDeleteDialog }>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            You are about to delete { this.props.item.title }. This cannot be undone.
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ this.onCancelDelete }>No</Button>
                        <Button onClick={ this.onConfirmDelete }>Yes</Button>
                    </DialogActions>
                </Dialog>

                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            { this.props.item.title }
                        </Typography>
                        { content }
                    </CardContent>
                    <CardActions>
                        { disablableButton((this.state.mode === Modes.Viewing) ? 'Edit' : 'Save', this.editOrSave, this.state.mode === Modes.Editing) }
                        { this.state.mode === Modes.Editing && disablableButton('Discard', this.discard) }
                        { disablableButton('Move') }
                        { disablableButton('Delete', this.openDeleteDialog) }
                    </CardActions>
                </Card>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return { item: props.item }
})(withRouter(ItemDetailsCard))