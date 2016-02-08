import test from 'tape';
import {createStore} from 'redux';
import {manage} from '../../src/index';
import {sleep} from '../common';


test('recipe3: dispatch await for action', async (assert) => {
  function reducer(state=[], action) {
    if (action.type.startsWith('@@')) {
      return [...state];
    } else {
      return [...state, action];
    }
  }

  async function saga(state, action, {dispatch, delay}) {
    switch (action.type) {
      case 'a1':
        await delay(50);
        dispatch({type: 'a2'});
        break;
      case 'a2':
        await delay(50);
        dispatch({type: 'a3'});
        break;
    }
  }

  const store = createStore(reducer, manage({saga}));

  await store.dispatch({type: 'a1'});

  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a2'}
  ], 'should wait for a1 action to complete');

  await sleep(100);
  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a2'},
    {type: 'a3'}
  ], 'should wait for a2 action to complete');

  assert.end();
});
