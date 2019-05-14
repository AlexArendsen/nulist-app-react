import React from 'react';
import logo from './logo.svg';
import './App.css';
import BaseView from './views/BaseView';
import { configureStore } from './redux/store';
import { Provider } from 'react-redux';

function App() {

  const store = configureStore();

  return (
    <Provider store={store}>
      <BaseView />
    </Provider>
  );
}

export default App;
