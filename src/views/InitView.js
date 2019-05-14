import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';

class BaseView extends Component {
    render() {
        return (<p>Loading, please wait...</p>)
    }
}

export default connect((state, props) => {
    return { }
})(BaseView)