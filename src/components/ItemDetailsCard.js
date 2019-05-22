import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { deleteItem, updateItem, moveItem } from '../redux/actions/itemActions';
import { Routes } from '../values/routes';
import MaterialMarkdown from './MaterialMarkdown';
import ItemPicker from './ItemPicker';
import { format } from 'date-fns';
import TimeAgo from 'react-timeago';

const Modes = { Viewing: 'MODE_VIEW', Editing: 'MODE_EDIT' }

class ItemDetailsCard extends Component {

    state = {
        showDeleteDialog: false,
        showMoveDialog: false,
        moveTarget: null,
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

    openMoveDialog = () => { this.setState({ showMoveDialog: true }) }
    onConfirmMove = (newParent) => {
        this.props.history.push(Routes.Item(this.props.item.parent_id));
        this.props.dispatch(moveItem(this.props.item, newParent ? newParent._id : null))
        this.setState({ showMoveDialog: false })
    }
    onCancelMove = () => { this.setState({ showMoveDialog: false }) }

    editOrSave = () => {
        if (this.state.mode === Modes.Editing) {
            const changedFields = Object.keys(this.state.fields)
                .filter(k => this.state.fields[k] !== undefined)
                .reduce((obj, next) => ({ ...obj, [next]: this.state.fields[next] }), {})
            this.props.dispatch(updateItem({ ...this.props.item, ...changedFields }))
        }
        this.setState({
            mode: this.state.mode == Modes.Viewing ? Modes.Editing : Modes.Viewing
        })
    }

    discard = () => { this.setState({ mode: Modes.Viewing }) }

    render() {

        const disablableButton = (title, onClick = (() => { }), isPrimary = false) => (
            <Button
                disabled={this.props.item.saving ? true : null}
                variant={isPrimary ? "contained" : "text"}
                color={isPrimary ? "primary" : "default"}
                onClick={onClick}>
                {title}
            </Button>)

        const moveDialog = (
            <Dialog open={this.state.showMoveDialog}>
                <DialogTitle>Move Item</DialogTitle>
                <DialogContent style={{ minWidth: '480px' }}>
                    <Typography variant="body1">
                        Choose a new parent for <strong>{this.props.item.title}</strong>
                    </Typography>

                    <ItemPicker onItemClick={item => this.setState({ moveTarget: item })} />

                    <Typography variant="body1">
                        Move <strong>{this.props.item.title}</strong> to <strong>{this.state.moveTarget ? this.state.moveTarget.title : 'root'}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancelMove}>Nevermind</Button>
                    <Button onClick={e => this.onConfirmMove(this.state.moveTarget)} variant="contained" color="primary">Yes, Move</Button>
                </DialogActions>
            </Dialog>
        )

        const deleteDialog = (
            <Dialog open={this.state.showDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        You are about to delete {this.props.item.title}. This cannot be undone.
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancelDelete}>Nevermind</Button>
                    <Button onClick={this.onConfirmDelete} variant="contained" color="primary">Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        )

        const isValidDate = (date) => !!date && typeof(date.getTime) === 'function' && !isNaN(date.getTime())
        const createdTime = (!isValidDate(this.props.item.created_at))
            ? null : (
                <Typography variant="caption">
                    { format(new Date(this.props.item.created_at), 'D MMM YYYY, hh:mm:ss a') } (<TimeAgo date={ this.props.item.created_at } />)
                </Typography>
            )

        const editableContent = (this.state.mode == Modes.Viewing)
            ? (
                <Fragment>
                    <Typography variant="h5" gutterBottom>{this.props.item.title}</Typography>
                    <MaterialMarkdown source={this.props.item.description} />
                </Fragment>
            ) : (
                <Fragment>
                    <TextField onChange={ e => this.setState({ fields: { ...this.state.fields, title: e.target.value } }) }
                        defaultValue={ this.props.item.title }
                        label="Title"
                        variant="outlined"
                        style={{ marginBottom: '16px' }}
                        fullWidth />
                    <TextField
                        onChange={e => this.setState({ fields: { ...this.state.fields, description: e.target.value } })}
                        defaultValue={this.props.item.description}
                        label="Description"
                        variant="outlined"
                        rows="12"
                        fullWidth
                        multiline />
                </Fragment>
            )

        return (
            <Fragment>

                {deleteDialog}
                {moveDialog}

                <Card>
                    <CardContent>
                        {editableContent}
                        {createdTime}
                    </CardContent>
                    <CardActions>
                        {disablableButton((this.state.mode === Modes.Viewing) ? 'Edit' : 'Save', this.editOrSave, this.state.mode === Modes.Editing)}
                        {this.state.mode === Modes.Editing && disablableButton('Discard', this.discard)}
                        {disablableButton('Move', this.openMoveDialog)}
                        {disablableButton('Delete', this.openDeleteDialog)}
                    </CardActions>
                </Card>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return { item: props.item }
})(withRouter(ItemDetailsCard))