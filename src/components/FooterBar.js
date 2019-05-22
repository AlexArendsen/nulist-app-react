import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import ResponsiveGrid from './ResponsiveGrid';

class FooterBar extends Component {
    render() {
        return (
            <ResponsiveGrid style={{ padding: '32px 0' }}>
                <Typography variant="h3">NuList</Typography>
            </ResponsiveGrid>
        )
    }
}

export default connect((state, props) => {
    return { config: state.config || { layout: {} } }
})(FooterBar)