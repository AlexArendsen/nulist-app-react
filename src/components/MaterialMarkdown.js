import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Markdown from 'markdown-to-jsx';
import { Typography, withStyles, } from '@material-ui/core';

// Yoinked from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/page-layout-examples/blog/Markdown.js
const styles = theme => ({
    listItem: {
        marginTop: theme.spacing.unit,
    },
});

const overrides = {
    h1: { component: props => <Typography gutterBottom variant="h4" {...props} /> },
    h2: { component: props => <Typography gutterBottom variant="h6" {...props} /> },
    h3: { component: props => <Typography gutterBottom variant="subtitle1" {...props} /> },
    h4: { component: props => <Typography gutterBottom variant="caption" paragraph {...props} /> },
    p: { component: props => <Typography paragraph {...props} /> },
    li: {
        component: withStyles(styles)(({ classes, ...props }) => (
            <li className={classes.listItem}>
                <Typography component="span" {...props} />
            </li>
        )),
    },
}

class MaterialMarkdown extends Component {

    render() {

        if (!this.props.source) return null;

        // markdown-to-jsx doesn't process lists if they don't have a leading newline, so
        // I shim those in here with some fancy regex footwork
        const withPaddedLists = this.props.source.replace(/((?:^|\n)[^\*].*)\n\*/g, '$1\n\n*')

        return (
            <Markdown options={overrides}>{withPaddedLists}</Markdown>
        )
    }
}

export default connect((state, props) => {
    return { source: props.source }
})(MaterialMarkdown)