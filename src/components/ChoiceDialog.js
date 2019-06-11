import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@material-ui/core';
import SimpleRadioSelection from './SimpleRadioSelection';

class ChoiceDialog extends Component {

    state = {
        selectedValue: (this.props.choices[0] || {}).value
    }

    handleCancel = () => { this.props.onCancel() }

    handleSubmit = () => { this.props.onSubmit(this.state.selectedValue) } 

    render() {
        return (
            <Dialog open={ this.props.open }>
                <DialogTitle>{ this.props.title }</DialogTitle>
                <DialogContent>
                    <SimpleRadioSelection
                        values={ this.props.choices }
                        onChange={ v => this.setState({ selectedValue: v }) } />
                    { this.props.children }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel}>Nevermind</Button>
                    <Button onClick={this.handleSubmit} variant="contained" color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default connect((state, props) => {
    return {
        title: props.title,
        choices: props.choices,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel,
        open: props.open
    }
})(ChoiceDialog)