import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

class FooterBar extends Component {
    render() {
        return (
            <div>
                <Grid container style={{ padding: '32px 0' }}>
                    <Grid item { ...this.props.config.layout.gutterWidths } />
                    <Grid item { ...this.props.config.layout.centerWidths } >
                        <Typography variant="h3">NuList</Typography>
                    </Grid>
                    <Grid item { ...this.props.config.layout.gutterWidths } />
                </Grid>
            </div>
        )
    }
}

export default connect((state, props) => {
    return { config: state.config || { layout: {} } }
})(FooterBar)