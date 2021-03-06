import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseView from './views/BaseView';
import { configureStore } from './redux/store';
import { Provider } from 'react-redux';
import LoginView from './views/LoginView';
import ItemView from './views/ItemView';
import ResponsiveGrid from './components/ResponsiveGrid';
import { Routes } from './values/routes';
import { Grid } from '@material-ui/core';
import HeaderBar from './components/HeaderBar';
import { InitializeApp } from './redux/actions/initializationActions';
import ContentRoot from './components/ContentRoot';
import Footer from './components/Footer';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorContainer from './components/ErrorContainer';

export default class App extends Component {

    store = configureStore();

    componentDidMount() {
        this.store.dispatch(InitializeApp())
    }

    render() {
        return (
            <Fragment>
                <Provider store={this.store}>

                    <Router>
                        <ErrorContainer />
                        <div id="full-height">
                            <HeaderBar />
                            <ResponsiveGrid style={{ margin: '32px 0', padding: '0 8px' }}>
                                <ContentRoot />
                            </ResponsiveGrid>
                        </div>
                        <Footer />
                    </Router>

                </Provider>
            </Fragment>
        );
    }
}
