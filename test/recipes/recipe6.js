import test from 'tape';
import {createStore} from 'redux';
import {process, TimeoutException} from '../../src/index';


test('recipe6: promise race with timeout', async (assert) => {
  function reducer(state=[], action) {
    if (action.type === '@@CLEAR') {
      return [];
    } else if (action.type.startsWith('@@')) {
      return [...state];
    } else {
      return [...state, action];
    }
  }

  async function saga(state=0, action, {dispatch, delay, timeout}) {
    switch (action.type) {
      case 'a1':
        try {
          await Promise.race([timeout(90), delay(45)]);
          dispatch({type: 'a3'});
        } catch (e) {
          if (e instanceof TimeoutException) {
            dispatch({type: 't1'});
          }
        }
        break;
      case 'a2':
        try {
          await Promise.race([timeout(45), delay(90)]);
          dispatch({type: 'a3'});
        } catch (e) {
          if (e instanceof TimeoutException) {
            dispatch({type: 't1'});
          }
        }
        break;
    }
  }

  const store = createStore(reducer, process({saga}));

  await store.dispatch({type: 'a1'});
  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a3'}
  ], 'dispatch a3 when timeout lesser than delay');

  store.dispatch({type: '@@CLEAR'});

  await store.dispatch({type: 'a2'});
  assert.deepEqual(store.getState(), [
    {type: 'a2'},
    {type: 't1'}
  ], 'dispatch a3 when timeout greater than delay');
  assert.end();
});
