import test from 'tape';
import {createStore} from 'redux';
import {manage} from '../../src/index';
import {sleep} from '../common';


test('recipe5: dispatch in parallel', async (assert) => {
  function reducer(state=[], action) {
    if (action.type.startsWith('@@')) {
      return [...state];
    } else {
      return [...state, action];
    }
  }

  async function saga1(state=0, action, {dispatch, delay}) {
    switch (action.type) {
      case 'a1':
        await delay(50);
        dispatch({type: 'a2'});
        break;
    }
  }

  async function saga2(state=0, action, {dispatch, delay}) {
    switch (action.type) {
      case 'a1':
        await delay(50);
        dispatch({type: 'a2'});
        break;
    }
  }

  async function saga3(state=0, action, {dispatch, delay}) {
    switch (action.type) {
      case 'a1':
        await delay(50);
        dispatch({type: 'a2'});
        break;
    }
  }

  async function saga4(state=0, action, {dispatch, delay}) {
    switch (action.type) {
      case 'a1':
        await delay(50);
        dispatch({type: 'a2'});
        break;
    }
  }

  const store = createStore(reducer, manage({saga1, saga2, saga3, saga4}));

  store.dispatch({type: 'a1'});
  await sleep(100);

  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a2'},
    {type: 'a2'},
    {type: 'a2'},
    {type: 'a2'}
  ], 'should dispatch a2 actions in parallel');

  assert.end();
});
