import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar } from '@material-ui/core';
import { Actions } from '../values/actions';

class ErrorContainer extends Component {

    handleDialogClose = () => {
        this.props.dispatch({ type: Actions.ClearMajorError })
    }

    handleSnackbarClose = () => {
        this.props.dispatch({ type: Actions.ClearMinorError })
    }

    render() {
        return (
            <Fragment>

                <Dialog
                    open={ !!this.props.dialogError }
                    onClose={ this.handleDialogClose }
                    >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The following unexpected error occurred while fulfilling your request:
                            <pre>
                                { this.props.dialogError }
                            </pre>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ this.handleDialogClose } color="primary">Dismiss</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={ !!this.props.snackbarError }
                    autoHideDuration={ 5000 }
                    onClose={ this.handleSnackbarClose }
                    message={ this.props.snackbarError } />

            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const e = state.error || {}
    return {
        dialogError: e.major,
        snackbarError: e.minor
    }
})(ErrorContainer)