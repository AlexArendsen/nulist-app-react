import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ObjectAsKeyValuePairs, KeyValuePairsAsObject } from '../helpers/itemHelper';
import { Grid, TextField, Button, InputAdornment } from '@material-ui/core';

class KeyValueEditor extends Component {

    state = {
        pairs: []
    }


    setPairs = async () => {
        await this.setState({ pairs: ObjectAsKeyValuePairs(this.props.srcObject).map((p, idx) => ({ ...p, idx })) })
    }

    componentDidMount() {
        this.setPairs()
    }

    handleChange = async (pair) => {
        await this.setState({
            pairs: [ ...this.state.pairs.filter(kv => kv.idx !== pair.idx), pair ]
        })
    }

    reportChange = () => {
        this.props.onChange(KeyValuePairsAsObject(this.state.pairs.filter(kv => !!kv.key)))
    }

    addNewPair = () => {
        this.setState({ pairs: [
            ...this.state.pairs,
            { idx: this.state.pairs.length + 1, key: '', value: '' }
        ] })
    }

    render() {
        return (
            <Fragment>
                <Grid spacing={ 8 } container>
                    {
                        (this.state.pairs || [])
                        .map(kv => (
                            <Fragment key={ kv.idx }>
                                <Grid item xs={4} md={3}>
                                    <TextField
                                        value={ kv.key }
                                        onChange={ e => this.handleChange({ ...kv, key: e.target.value }) }
                                        onBlur={ this.reportChange }
                                        label="Key"
                                        variant="outlined"
                                        fullWidth />
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <TextField
                                        value={ kv.value }
                                        onChange={ e => this.handleChange({ ...kv, value: e.target.value }) }
                                        onBlur={ this.reportChange }
                                        label="Value"
                                        variant="outlined"
                                        fullWidth />
                                </Grid>
                            </Fragment>
                        ))
                    }
                </Grid>
                <Button onClick={ this.addNewPair }>Add Property</Button>
            </Fragment>
        )
    }
}

export default connect((state, props) => {
    const noop = () => {}
    return {
        srcObject: props.data || null,
        onChange: typeof(props.onChange === 'function') ? props.onChange : noop
    }
})(KeyValueEditor)