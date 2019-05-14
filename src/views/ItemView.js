import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Views } from '../values/view';
import InitView from './InitView';
import { getAllItems, selectItem, goUp } from '../redux/actions/itemActions';

class ItemView extends Component {

    componentDidMount() {
        this.props.dispatch(getAllItems())
    }

    render() {

        const item = (i) => (
            <tr>
                <td><input type="checkbox" checked={ i.checked ? true : null } /></td>
                <td onClick={ e => this.props.dispatch(selectItem(i._id)) }>{ i.title }<br />{ i.description }</td>
                <td><button>Move</button></td>
                <td><button>Delete</button></td>
            </tr>
        )

        const itemList = (!this.props.items) ? (<p>...</p>) : this.props.items.map(item) 

        return (
            <Fragment>
                <p>Item View Works!</p>

                { this.props.itemId && (<button onClick={ e => this.props.dispatch(goUp()) }>Up</button>) }

                <table>
                    <tbody>
                        { itemList }
                    </tbody>
                </table>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    return {
        items: (state.parents || {})[props.itemId || null]
    }
})(ItemView)