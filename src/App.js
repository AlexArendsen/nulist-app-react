import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseView from './views/BaseView';
import { configureStore } from './redux/store';
import { Provider } from 'react-redux';
import LoginView from './views/LoginView';
import ItemView from './views/ItemView';
import { Routes } from './values/routes';
import { Grid } from '@material-ui/core';
import HeaderBar from './components/HeaderBar';
import FooterBar from './components/FooterBar';
import { InitializeApp } from './redux/actions/initializationActions';
import ContentRoot from './components/ContentRoot';
import Footer from './components/Footer';

export default class App extends Component {

    store = configureStore();

    componentDidMount() {
        this.store.dispatch(InitializeApp())
    }

    render() {
        return (
            <Fragment>
                <Provider store={this.store}>

                    <HeaderBar />
                    <ContentRoot />
                    <Footer />

                </Provider>
            </Fragment>
        );
    }
}
