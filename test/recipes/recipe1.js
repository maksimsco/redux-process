import test from 'tape';
import {createStore} from 'redux';
import {process} from '../../src/index';


test('recipe1: dispatch multiple actions', (assert) => {
  function reducer(state=[], action) {
    if (action.type.startsWith('@@')) {
      return [...state];
    } else {
      return [...state, action];
    }
  }

  async function saga(state, action, {dispatch}) {
    switch (action.type) {
      case 'a1':
        dispatch({type: 'a2'});
        dispatch({type: 'a3'});
        dispatch({type: 'a4'});
        break;
    }
  }

  const store = createStore(reducer, process({saga}));

  store.dispatch({type: 'a1'});

  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a2'},
    {type: 'a3'},
    {type: 'a4'}
  ], 'should dispatch 4 actions');

  assert.end();
});
