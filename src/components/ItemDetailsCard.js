import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card, CardContent, CardActions, Chip, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Checkbox, LinearProgress, Grid, Menu, MenuItem, InputAdornment } from '@material-ui/core';
import { deleteItem, updateItem, moveItem, uncheckItem, checkItem, deleteManyItems, moveManyItems, searchItems } from '../redux/actions/itemActions';
import { Routes } from '../values/routes';
import MaterialMarkdown from './MaterialMarkdown';
import ItemPicker from './ItemPicker';
import { format } from 'date-fns';
import TimeAgo from 'react-timeago';
import ItemProgressBar from './ItemProgressBar';
import DeleteDialog from './DeleteDialog';
import MoveDialog from './MoveDialog';
import { MoveOperations } from '../values/move-operations';
import { DeleteOperations } from '../values/delete-operations';
import { GetItemProps, GetItemPropAsList, ItemsAreEquivalent, KeyValuePairsAsObject, ObjectAsKeyValuePairs, GetItemPropOrDefault } from '../helpers/itemHelper';
import KeyValueEditor from './KeyValueEditor';

const Modes = { Viewing: 'MODE_VIEW', Editing: 'MODE_EDIT' }

class ItemDetailsCard extends Component {

    state = {
        showDeleteDialog: false,
        showMoveDialog: false,
        additionalActionsAnchor: null,
        mode: Modes.Viewing,
        fields: {
            description: null,
            title: null,
            props: null
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
                title: this.props.item.title,
                props: this.props.item.props
            }
        })
    }

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

    updateField = (key, value) => { this.setState({ fields: { ...this.state.fields, [key]: value } }) }

    discard = () => { this.setState({ mode: Modes.Viewing }) }

    changesMade = () => ItemsAreEquivalent(this.props.item, this.state.fields)

    handleConfirmDelete = (e) => {
        if (e.operation === DeleteOperations.Self) this.props.history.push(Routes.Item(this.props.item.parent_id))
        this.setState({ showDeleteDialog: false })
    }

    handleConfirmMove = (e) => {
        if (e.operation === MoveOperations.Self) this.props.history.push(Routes.Item(this.props.item.parent_id))
        this.setState({ showMoveDialog: false })
    }

    handleTagClick = (query) => {
        if (query[0] !== '#') query = `#${query.trim()}`
        this.props.dispatch(searchItems(query))
        this.props.history.push(Routes.Search())
    }

    render() {
        const item = this.props.item;
        const editing = this.state.model === Modes.Viewing;

        const disablableButton = (title, onClick = (() => { }), isPrimary = false) => (
            <Button
                disabled={item.saving ? true : null}
                variant={isPrimary ? "contained" : "text"}
                color={isPrimary ? "primary" : "default"}
                type={isPrimary ? 'submit' : 'button'}
                onClick={onClick}>
                {title}
            </Button>)

        const isValidDate = (date) => !!date && typeof(date.getTime) === 'function' && !isNaN(date.getTime())
        const timeFragment = (date, prefix) => (!isValidDate(date))
            ? null : (
                <Typography variant="caption">
                    { prefix } { format(new Date(date), 'ddd D MMM YYYY, hh:mm:ss a') } (<TimeAgo date={ date } />)
                </Typography>
            )
        const createdTime = timeFragment(this.props.item.created_at, 'Created:')
        const updatedTime = timeFragment(this.props.item.updated_at, 'Updated:')

        const propEditor = <KeyValueEditor
                data={ this.state.fields.props }
                onChange={ newObj => this.updateField('props', newObj) } />

        const tagChip = (label, index) => <Chip
            key={ index }
            label={ label }
            style={{ marginRight: '8px' }}
            onClick={ e => this.handleTagClick(label) }
            variant="outlined" />

        const editableContent = (this.state.mode == Modes.Viewing)
            ? (
                <Fragment>
                    <Typography variant="h5" gutterBottom>
                        {item.title}
                        { item.props['alias'] && (<small style={{ marginLeft: '8px' }}>{ item.props['alias'] }</small>) }
                    </Typography>
                    { (item.props['tags'] || '').split(',').filter(s => !!s).map(tagChip) }
                    <MaterialMarkdown source={item.description} />
                </Fragment>
            ) : (
                <Fragment>
                    <TextField
                        onChange={ e => this.updateField('title', e.target.value) }
                        defaultValue={ item.title }
                        label="Title"
                        variant="outlined"
                        style={{ marginBottom: '16px' }}
                        fullWidth />
                    <TextField
                        onChange={ e => this.updateField('description', e.target.value) }
                        defaultValue={item.description}
                        label="Description"
                        variant="outlined"
                        rows="12"
                        style={{ marginBottom: '16px' }}
                        fullWidth
                        multiline />
                    { propEditor }
                </Fragment>
            )

        const completedPercent = 100 * (!!item.descendants ? item.completed / item.descendants : (item.checked ? 1 : 0))

        const saving = (
            <Typography variant="body1" style={{ float: 'right' }}>
                <CircularProgress size={ 14 } />
                <span style={{ color: '#777', marginLeft: '8px' }}>Saving</span>
            </Typography>
        )

        const saveButtonLabel = (this.state.mode === Modes.Viewing) ? 'Edit' : 'Save';

        return (
            <Fragment>

                <DeleteDialog
                    item={ this.props.item }
                    open={ this.state.showDeleteDialog }
                    onConfirm={ this.handleConfirmDelete }
                    onCancel={ e => this.setState({ showDeleteDialog: false }) } />
                <MoveDialog
                    item={ this.props.item }
                    open={ this.state.showMoveDialog }
                    onConfirm={ this.handleConfirmMove }
                    onCancel={ e => this.setState({ showMoveDialog: false }) } />

                <form action="javascript:void(0)">
                    <Card>
                        <CardContent>
                            { item.saving && saving }
                            { editableContent }
                            <Grid container style={{ marginTop: '8px' }}>
                                <Grid item xs={ 12 } md={ 6 } style={{ marginBottom: '8px' }}>
                                    { createdTime }
                                    { updatedTime }
                                </Grid>
                                <Grid item xs={ 12 } md={ 6 }>
                                    <Checkbox checked={ item.checked } style={{ float: 'left', padding: '0 8px 0 0' }} onChange={ this.handleCheck } />
                                    <ItemProgressBar item={item} />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            {disablableButton(saveButtonLabel, this.editOrSave, this.changesMade() && this.state.mode === Modes.Editing)}
                            {this.state.mode === Modes.Editing && disablableButton('Discard', this.discard)}
                            {disablableButton('Move...', () => this.setState({ showMoveDialog: true }))}
                            {disablableButton('Delete...', () => this.setState({ showDeleteDialog: true }))}
                        </CardActions>
                    </Card>
                </form>
            </Fragment>
        )
    }
}

export default connect((state, props) => {

    const m = (v, d = {}) => v || d;

    return {
        item: { props: {}, ...props.item},
        children: state.items.filter(i => i.parent_id === props.item._id)
    }
})(withRouter(ItemDetailsCard))