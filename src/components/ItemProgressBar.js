import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { LinearProgress, Typography } from '@material-ui/core';

class ItemProgressBar extends Component {
    render() {

        const item = this.props.item;
        const itemFraction = `${item.completed} / ${item.descendants}`
        const itemCompletePercent = Math.round(item.checked ? 100 : (item.descendants ? 100*(item.completed / item.descendants) : 0 ));

        return (
            <Fragment>
                <LinearProgress value={ itemCompletePercent } variant={ item.saving ? 'indeterminate' : 'determinate' } style={{ height: '8px' }} />
                <Typography variant="caption">{ itemFraction } &middot; { itemCompletePercent }%</Typography>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {
        item: props.item
    }
})(ItemProgressBar)