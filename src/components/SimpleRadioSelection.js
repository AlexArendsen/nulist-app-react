import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

class SimpleRadioSelection extends Component {

    state = { selection: this.props.values[0].value }

    handleChange = (event) => {
        const value = event.target.value
        this.setState({ selection: value })
        this.props.onChange(value)
    }

    render() {
        return (
            <FormControl component="fieldset">
                { this.props.title && <FormLabel component="legend">{ this.props.title }</FormLabel> }
                <RadioGroup onChange={ this.handleChange } value={ this.state.selection } row={ this.props.horizontal ? true : null }>
                    { this.props.values.map(v => (
                        <FormControlLabel key={v.value} label={ v.label } value={ v.value } control={ <Radio /> } />
                    ))}
                </RadioGroup>
            </FormControl>
        )
    }
}

export default connect((state, props) => {
    return {
        title: props.title,
        values: props.values,
        onChange: props.onChange,
        horizontal: props.horizontal
    }
})(SimpleRadioSelection)