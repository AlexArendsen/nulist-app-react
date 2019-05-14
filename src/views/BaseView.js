import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';
import InitView from './InitView';
import LoginView from './LoginView';
import ItemView from './ItemView';
import OutlineView from './OutlineView';
import ErrorView from './ErrorView';
import { InitializeApp } from '../redux/actions/initializationActions';
import { Actions } from '../values/actions';

class BaseView extends Component {

    componentDidMount() {
        this.props.dispatch(InitializeApp());
    }

    render() {

        const content = {
            [Views.Initializing]: (<InitView />),
            [Views.Login]: (<LoginView />),
            [Views.Item]: (<ItemView itemId={this.props.selectedItemId} />),
            [Views.Outline]: (<OutlineView />),
            [Views.Error]: (<ErrorView />)
        }[this.props.view || Views.Error];

        const header = (!this.props.userToken)
            ? (<p></p>) : (<button onClick={ e => this.props.dispatch({ type: Actions.Logout }) }>Log Out</button>)

        return (
            <Fragment>
                { header }
                { content }
            </Fragment>
        )

    }
}

export default connect((state, props) => {
    return {
        view: state.view,
        userToken: state.userToken,
        selectedItemId: (state.selectedItem || {})._id
    }
})(BaseView)