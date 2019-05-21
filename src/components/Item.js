import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Routes } from '../values/routes';
import { Link } from 'react-router-dom';
import { checkItem, uncheckItem } from '../redux/actions/itemActions';
import { Card, CardContent, Typography, Checkbox } from '@material-ui/core';
import { withRouter } from 'react-router';

class Item extends Component {

    handleChecked = (e) => {
        this.props.dispatch(this.props.model.checked ? uncheckItem(this.props.model._id) : checkItem(this.props.model._id)) 
    }

    handleClick = (e) => {
        this.props.history.push(Routes.Item(this.props.model._id));
    }

    render() {
        const model = this.props.model;
        const description = `${model.completed} / ${model.descendants} | ${model.description}`;

        return (<p>Deprecated</p>)

        //return (
            //<Card onClick={ this.handleClick }>
                //<CardContent>
                    //<Checkbox onChange={ this.handleChecked } value={ model.checked } style={{ float: 'right' }} />
                    //<Typography variant="body1" style={{ fontWeight: 'bold' }}>{ model.title }</Typography>
                    //<Typography variant="body1">{ description }</Typography>
                //</CardContent>
            //</Card>
        //)

        /*return (
            <ListItem onClick={ this.handleClick } key={model.index} button disabled={ model.saving }>
                <ListItemText primary={ model.title } secondary={ description } />
                <ListItemSecondaryAction>
                    <Checkbox
                        checked={ model.checked }
                        onChange={ this.handleChecked }
                        disabled={ model.saving || null }
                        />
                </ListItemSecondaryAction>
            </ListItem>
        )*/
    }

}

export default connect((state, props) => {
    return {
        model: props.item
    }
})(withRouter(Item))