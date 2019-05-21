import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Routes } from '../values/routes';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router';

class ItemBreadcrumbTrail extends Component {

    parentsLookup = null

    handleClick = (item) => { this.props.history.push(Routes.Item(item._id)); }

    handleGoHome = () => { this.props.history.push(Routes.Items()) }

    render() {

        const crumbs = []
        if (!!this.props.current) {
            let wrk = this.props.current;
            while (!!wrk) {
                crumbs.push(wrk)
                wrk = this.props.items.find(i => i._id == wrk.parent_id)
            }
            crumbs.reverse();
        }

        const style = {
            style: { },
            size: 'small'
        }

        const atHome = !crumbs || !crumbs.length;
        const clickableChip = (item) => item == null
            ? (<Button { ...style } onClick={ this.handleGoHome }>Home</Button>)
            : (<Button { ...style } onClick={ e => this.handleClick(item) }>{ item.title }</Button>);
        const endChip = (item) => item == null
            ? (<Button { ...style } disabled>Home</Button>)
            : (<Button { ...style } disabled>{ item.title }</Button>);

        if (atHome) return (endChip(null))
        return (
            <Fragment>
                { [ null, ...crumbs.slice(0, crumbs.length - 1) ].map(i => (<Fragment key={ ( i ? i._id : 'null') }> { clickableChip(i) } / </Fragment>)) }
                { endChip(crumbs.slice(crumbs.length - 1)[0]) }
            </Fragment>
        )
    }

}

export default connect((state, props) => {
    return {
        current: props.item,
        items: state.items
    }
})(withRouter(ItemBreadcrumbTrail))