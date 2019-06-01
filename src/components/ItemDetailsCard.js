import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Checkbox,
    LinearProgress,
    Grid,
    Menu,
    MenuItem
} from '@material-ui/core';
import { deleteItem, updateItem, moveItem, uncheckItem, checkItem, deleteManyItems, moveManyItems } from '../redux/actions/itemActions';
import { Routes } from '../values/routes';
import MaterialMarkdown from './MaterialMarkdown';
import ItemPicker from './ItemPicker';
import { format } from 'date-fns';
import TimeAgo from 'react-timeago';
import ItemProgressBar from './ItemProgressBar';

const Modes = { Viewing: 'MODE_VIEW', Editing: 'MODE_EDIT' }

const MoveVariants = { Self: 'MOVE_SELF', All: 'MOVE_ALL', Complete: 'MOVE_COMPLETE', Incomplete: 'MOVE_INCOMPLETE' }

const DeleteVariants = { Self: 'DELETE_SELF', Complete: 'DELETE_COMPLETE', Incomplete: 'DELETE_INCOMPLETE' }

class ItemDetailsCard extends Component {

    state = {
        showDeleteDialog: false,
        showMoveDialog: false,
        additionalActionsAnchor: null,
        moveTarget: null,
        moveVariant: MoveVariants.Self,
        deleteVariant: DeleteVariants.Self,
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
            fields: {
                description: this.props.item.description,
                title: this.props.item.title
            }
        })
    }

    handleAdditionalActionsOpen = (e) => { this.setState({ additionalActionsAnchor: e.currentTarget }) }
    handleAdditionalActionsClose = () => { this.setState({ additionalActionsAnchor: null }) }
    openMoveAllDialog = () => {
        this.handleAdditionalActionsClose();
        this.setState({ showMoveDialog: true, moveVariant: MoveVariants.All })
    }

    openMoveCompleteDialog = () => {
        this.handleAdditionalActionsClose();
        this.setState({ showMoveDialog: true, moveVariant: MoveVariants.Complete })
    }

    openMoveIncompleteDialog = () => {
        this.handleAdditionalActionsClose();
        this.setState({ showMoveDialog: true, moveVariant: MoveVariants.Incomplete })
    }

    openDeleteCompleteDialog = () => {
        this.handleAdditionalActionsClose();
        this.setState({ showDeleteDialog: true, deleteVariant: DeleteVariants.Complete })
    }

    openDeleteIncompleteDialog = () => {
        this.handleAdditionalActionsClose();
        this.setState({ showDeleteDialog: true, deleteVariant: DeleteVariants.Incomplete })
    }


    openDeleteDialog = () => { this.setState({ showDeleteDialog: true, deleteVariant: DeleteVariants.Self }) }
    onConfirmDelete = () => {
        switch (this.state.deleteVariant) {
            case DeleteVariants.Self:
                this.props.history.push(Routes.Item(this.props.item.parent_id));
                this.props.dispatch(deleteItem(this.props.item._id));
                break;
            case DeleteVariants.Complete:
                this.props.dispatch(deleteManyItems(this.props.children.filter(c => c.checked).map(c => c._id)))
                break;
            case DeleteVariants.Incomplete:
                this.props.dispatch(deleteManyItems(this.props.children.filter(c => !c.checked).map(c => c._id)))
                break;
        }
        this.setState({ showDeleteDialog: false })
    }
    onCancelDelete = () => { this.setState({ showDeleteDialog: false }) }

    openMoveDialog = () => { this.setState({ showMoveDialog: true, moveVariant: MoveVariants.Self }) }
    onConfirmMove = (newParent) => {
        const parentId = newParent ? newParent._id : null
        switch (this.state.moveVariant) {
            case MoveVariants.Self:
                this.props.history.push(Routes.Item(this.props.item.parent_id));
                this.props.dispatch(moveItem(this.props.item, parentId))
                break;
            case MoveVariants.All:
                this.props.dispatch(moveManyItems(this.props.children.map(c => c._id), parentId))
                break;
            case MoveVariants.Complete:
                const completeIds = this.props.children.filter(c => c.checked && c._id !== parentId).map(c => c._id)
                this.props.dispatch(moveManyItems(completeIds, parentId))
                break;
            case MoveVariants.Incomplete:
                const incompleteIds = this.props.children.filter(c => !c.checked && c._id !== parentId).map(c => c._id)
                this.props.dispatch(moveManyItems(incompleteIds, parentId))
                break;
        }
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

    handleCheck = () => {
        this.props.dispatch(
            this.props.item.checked ? uncheckItem(this.props.item._id) : checkItem(this.props.item._id)
        )
    }

    discard = () => { this.setState({ mode: Modes.Viewing }) }

    render() {
        const item = this.props.item;

        const disablableButton = (title, onClick = (() => { }), isPrimary = false) => (
            <Button
                disabled={item.saving ? true : null}
                variant={isPrimary ? "contained" : "text"}
                color={isPrimary ? "primary" : "default"}
                type={isPrimary ? 'submit' : 'button'}
                onClick={onClick}>
                {title}
            </Button>)

        const moveDialog = (
            <Dialog open={this.state.showMoveDialog}>
                <DialogTitle>Move Item</DialogTitle>
                <DialogContent style={{ minWidth: '480px' }}>
                    <Typography variant="body1">
                        Choose a new parent for <strong>{item.title}</strong>
                    </Typography>

                    <ItemPicker onItemClick={item => this.setState({ moveTarget: item })} />

                    <Typography variant="body1">
                        Move <strong>{
                            ({
                                [MoveVariants.Self]: item.title,
                                [MoveVariants.All]: `all ${this.props.children.length} child item(s)`,
                                [MoveVariants.Complete]: `all ${this.props.children.filter(c => c.checked).length} completed child item(s)`,
                                [MoveVariants.Incomplete]: `all ${this.props.children.filter(c => !c.checked).length} incomplete child item(s)`
                            }[this.state.moveVariant])
                        }</strong> to <strong>{this.state.moveTarget ? this.state.moveTarget.title : 'root'}</strong>?
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
                        You are about to delete
                        {
                            ({
                                [DeleteVariants.Self]: item.title,
                                [DeleteVariants.Complete]: `all ${this.props.children.filter(c => c.checked).length} completed child item(s)`,
                                [DeleteVariants.Incomplete]: `all ${this.props.children.filter(c => !c.checked).length} incomplete child item(s)`
                            }[this.state.deleteVariant])
                        }
                        . This cannot be undone.
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancelDelete}>Nevermind</Button>
                    <Button onClick={this.onConfirmDelete} variant="contained" color="primary">Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        )

        const additionalActions = (
            <div>
                <Button
                    aria-owns={this.state.additionalActionsAnchor ? "additional-actions-menu" : undefined}
                    aria-haspopup="true"
                    onClick={ this.handleAdditionalActionsOpen }>
                    More
                </Button>
                <Menu
                    id="additional-actions-menu"
                    anchorEl={ this.state.additionalActionsAnchor }
                    open={ !!this.state.additionalActionsAnchor }
                    onClose={ this.handleAdditionalActionsClose }
                >
                    <MenuItem onClick={this.openMoveAllDialog}>Move All</MenuItem>
                    <MenuItem onClick={this.openMoveCompleteDialog}>Move Complete</MenuItem>
                    <MenuItem onClick={this.openMoveIncompleteDialog}>Move Incomplete</MenuItem>
                    <MenuItem onClick={this.openDeleteCompleteDialog}>Delete Complete</MenuItem>
                    <MenuItem onClick={this.openDeleteIncompleteDialog}>Delete Incomplete</MenuItem>
                </Menu>
            </div>
        )

        const isValidDate = (date) => !!date && typeof(date.getTime) === 'function' && !isNaN(date.getTime())
        const createdTime = (!isValidDate(item.created_at))
            ? null : (
                <Typography variant="caption">
                    { format(new Date(item.created_at), 'D MMM YYYY, hh:mm:ss a') } (<TimeAgo date={ item.created_at } />)
                </Typography>
            )

        const editableContent = (this.state.mode == Modes.Viewing)
            ? (
                <Fragment>
                    <Typography variant="h5" gutterBottom>{item.title}</Typography>
                    <MaterialMarkdown source={item.description} />
                </Fragment>
            ) : (
                <Fragment>
                    <TextField onChange={ e => this.setState({ fields: { ...this.state.fields, title: e.target.value } }) }
                        defaultValue={ item.title }
                        label="Title"
                        variant="outlined"
                        style={{ marginBottom: '16px' }}
                        fullWidth />
                    <TextField
                        onChange={e => this.setState({ fields: { ...this.state.fields, description: e.target.value } })}
                        defaultValue={item.description}
                        label="Description"
                        variant="outlined"
                        rows="12"
                        fullWidth
                        multiline />
                </Fragment>
            )

        const completedPercent = 100 * (!!item.descendants ? item.completed / item.descendants : (item.checked ? 1 : 0))

        const saving = (
            <Typography variant="body1" style={{ float: 'right' }}>
                <CircularProgress size={ 14 } />
                <span style={{ color: '#777', marginLeft: '8px' }}>Saving</span>
            </Typography>
        )

        return (
            <Fragment>

                {deleteDialog}
                {moveDialog}

                <form action="javascript:void(0)">
                    <Card>
                        <CardContent>
                            { item.saving && saving }
                            { editableContent }
                            <Grid container style={{ marginTop: '8px' }}>
                                <Grid item xs={ 12 } md={ 6 } style={{ marginBottom: '8px' }}>
                                    { createdTime }
                                </Grid>
                                <Grid item xs={ 12 } md={ 6 }>
                                    <Checkbox checked={ item.checked } style={{ float: 'left', padding: '0 8px 0 0' }} onChange={ this.handleCheck } />
                                    <ItemProgressBar item={item} />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            {disablableButton((this.state.mode === Modes.Viewing) ? 'Edit' : 'Save', this.editOrSave, this.state.mode === Modes.Editing)}
                            {this.state.mode === Modes.Editing && disablableButton('Discard', this.discard)}
                            {disablableButton('Move', this.openMoveDialog)}
                            {disablableButton('Delete', this.openDeleteDialog)}
                            {additionalActions}
                        </CardActions>
                    </Card>
                </form>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {
        item: props.item,
        children: state.items.filter(i => i.parent_id === props.item._id)
    }
})(withRouter(ItemDetailsCard))