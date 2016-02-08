import test from 'tape';
import {createStore} from 'redux';
import {manage} from '../../src/index';


test('recipe2: state reduced before dispatch action in saga', (assert) => {
  function reducer1(state=[], action) {
    if (action.type.startsWith('@@')) {
      return [...state];
    } else {
      return [...state, action];
    }
  }

  function reducer2(state=0, action) {
    switch (action.type) {
      case 'a1':
        return state + 1;
      case 'a2':
        return state + 1;
      default:
        return state;
    }
  }

  function reducer(state, action) {
    return {
      reducer1: reducer1(state ? state.reducer1 : state, action),
      reducer2: reducer2(state ? state.reducer2 : state, action)
    };
  }

  async function saga(state, action, {dispatch}) {
    switch (action.type) {
      case 'a1':
        if (state.reducer2 === 2) {
          dispatch({type: 'a2'});
        }
        break;
      case 'a2':
        if (state.reducer2 === 3) {
          dispatch({type: 'a3'});
        }
        break;
    }
  }

  const store = createStore(reducer, manage({saga}));

  store.dispatch({type: 'a1'});
  store.dispatch({type: 'a1'});

  assert.deepEqual(store.getState().reducer1, [
    {type: 'a1'},
    {type: 'a1'},
    {type: 'a2'},
    {type: 'a3'}
  ], 'should dispatch action a2 then reduce state, dispatch action a3');

  assert.end();
});
