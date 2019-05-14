import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';
import InitView from './InitView';

class ErrorView extends Component {
    render() {
        return (
            <Fragment>
                <h3>Oh No! An Error Occurred</h3>
                <pre>{ this.props.error || 'Unknown Error' }</pre>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {
        error: state.error
    }
})(ErrorView)