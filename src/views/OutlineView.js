import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';
import InitView from './InitView';

class OutlineView extends Component {
    render() {
        return (<p>Outline View Works!</p>)
    }
}

export default connect((state, props) => {
    return { }
})(OutlineView)