import test from 'tape';
import {createStore} from 'redux';
import {process} from '../../src/index';


test('recipe4: dispatch await for actions in chain', async (assert) => {
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
        await dispatch({type: 'a2'});
        break;
      case 'a2':
        await delay(50);
        dispatch({type: 'a3'});
        break;
    }
  }

  const store = createStore(reducer, process({saga}));

  await store.dispatch({type: 'a1'});

  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a2'},
    {type: 'a3'}
  ], 'should wait for a1, a2 actions to complete');

  assert.end();
});
