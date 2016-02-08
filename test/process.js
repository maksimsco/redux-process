import test from 'tape';
import {createStore} from 'redux';
import {manage, TimeoutException} from '../src/index';
import {sleep} from './common';


test('store process args', (assert) => {
  assert.plan(1);
  assert.doesNotThrow(() => createStore(() => {}, manage()), 'does not throw with empty process args');
});

test('store dispatch action', async (assert) => {
  assert.plan(2);

  const store = createStore(() => {}, manage());

  try {
    await store.dispatch('z');
    assert.fail('throws when action type undefined');
  } catch (e) {
    assert.pass('throws when action type undefined');
  }

  try {
    await store.dispatch({type: 'z'});
    assert.pass('does not throw when action type defined');
  } catch (e) {
    assert.fail('does not throw when action type defined');
  }
});

test('store reducer', (assert) => {
  assert.plan(1);

  function reducer(state=[], action) {
    if (action.type.startsWith('@@')) {
      return [...state];
    } else {
      return [...state, action];
    }
  }

  const store = createStore(reducer, manage());

  store.dispatch({type: 'a1'});
  store.dispatch({type: 'a2'});
  store.dispatch({type: 'a3'});

  assert.deepEqual(store.getState(), [
    {type: 'a1'},
    {type: 'a2'},
    {type: 'a3'}
  ], 'dispatch should reduce state');
});

test('store ehnancer', async (assert) => {
  assert.plan(2);

  const store = createStore(() => {}, manage());

  const a = store.dispatch({type: 'a1'});
  const b = store.dispatch({type: 'a2'});

  assert.deepEqual([
    typeof a.then,
    typeof b.then
  ], [
    'function',
    'function'
  ], 'dispatch should return a promise');

  assert.deepEqual([
    await a,
    await b
  ], [
    {type: 'a1'},
    {type: 'a2'}
  ], 'dispatch promise should resolve to action');
});

test('store process pass dependencies', (assert) => {
  assert.plan(4);

  let result = 0;
  let dep1;
  let dep2;
  let dep3;

  async function saga(state, action, {dispatch, delay, timeout, custom}) {
    dep1 = dispatch;
    dep2 = delay;
    dep3 = timeout;
    custom();
  }

  const store = createStore(() => {}, manage({saga}, {custom: () => result = 1}));

  store.dispatch({type: 'a1'});

  assert.equal(result, 1, 'pass custom dependencies');
  assert.ok(dep1, 'pass dispatch');
  assert.ok(dep2, 'pass delay');
  assert.ok(dep3, 'pass timeout');
});

test('store process default delay dependecy', async (assert) => {
  assert.plan(2);

  let result = false;

  async function saga(state, action, {delay}) {
    await delay(50);
    result = true;
  }

  const store = createStore(() => {}, manage({saga}));

  store.dispatch({type: 'a1'});
  await sleep(0);
  assert.false(result, 'waits for 50ms');
  await sleep(100);
  assert.true(result, 'resumes after 50ms');
});

test('store process default timeot dependecy', async (assert) => {
  assert.plan(1);

  let result = false;

  async function saga(state, action, {timeout}) {
    try {
      await timeout(0);
    } catch (e) {
      if (e instanceof TimeoutException) {
        result = true;
      }
    }

  }

  const store = createStore(() => {}, manage({saga}));

  await store.dispatch({type: 'a1'});

  assert.true(result, 'timeout dependecy throws TimeoutException');
});

test('store process executes process', (assert) => {
  assert.plan(3);

  let result1 = false;
  let result2 = false;
  let result3 = false;

  async function saga1() {
    result1 = true;
  }

  async function saga2() {
    result2 = true;
  }

  async function saga3() {
    result3 = true;
  }

  const store = createStore(() => {}, manage({saga1, saga2, saga3}));

  store.dispatch({type: 'a1'});

  assert.true(result1, 'executes process1');
  assert.true(result2, 'executes process2');
  assert.true(result3, 'executes process3');
});

test('store process reduces first then passes state to process', (assert) => {
  assert.plan(2);

  function reducer(state=1, action) {
    switch (action.type) {
      case 'a1':
        return state + 5;
      case 'a2':
        return state * 2;
      default:
        return state;
    }
  }

  const result = [];

  async function saga(state) {
    result.push(state);
  }

  const store = createStore(reducer, manage({saga}));

  store.dispatch({type: 'a1'});
  assert.deepEqual(result, [
    6
  ], 'passes reducer state for a1 action');

  store.dispatch({type: 'a2'});
  assert.deepEqual(result, [
    6,
    12
  ], 'passes reducer state for a2 action');

});

test('store process actions dispatched are executed in process', (assert) => {
  assert.plan(1);

  let result = false;
  async function saga(state, action, {dispatch}) {
    switch (action.type) {
      case 'a1':
        dispatch({type: 'a2'});
        break;
      case 'a2':
        result = true;
        break;
      default:
        break;
    }
  }

  const store = createStore(() => {}, manage({saga}));

  store.dispatch({type: 'a1'});
  assert.true(result, 'action executes in process');
});

test('store process actions dispatched are reduced', (assert) => {
  assert.plan(1);

  function reducer(state=1, action) {
    switch (action.type) {
      case 'a1':
        return state + 5;
      case 'a2':
        return state * 2;
      default:
        return state;
    }
  }

  async function saga(state, action, {dispatch}) {
    switch (action.type) {
      case 'a1':
        dispatch({type: 'a2'});
        break;
      default:
        break;
    }
  }

  const store = createStore(reducer, manage({saga}));

  store.dispatch({type: 'a1'});
  assert.equal(store.getState(), 12, 'action reduced');
});
