import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {process} from 'redux-process';
import {Provider} from 'react-redux';
import reducers from './redux';
import sagas from './sagas';
import Container from './container';


const store = createStore(reducers, process(sagas));

if (module.hot) {
  module.hot.accept('./redux', () => {
    const modified = require('./redux').default;
    store.replaceReducer(modified);
  });
}

const component = (
  <Provider store={store}>
    <Container />
  </Provider>
);

render(component, document.getElementById('root-mount'));
