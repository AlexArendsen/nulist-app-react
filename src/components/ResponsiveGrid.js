import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

class ResponsiveGrid extends Component {
    render() {
        return (
            <Grid container style={ this.props.style || {}}>
                <Grid item { ...this.props.config.layout.gutterWidths } />
                <Grid item { ...this.props.config.layout.centerWidths } >
                    { this.props.children }
                </Grid>
                <Grid item { ...this.props.config.layout.gutterWidths } />
            </Grid>
        )
    }
}

export default connect((state, props) => {
    return { config: state.config || { layout: {} }}
})(ResponsiveGrid)