**Process manager for Redux to orchestrate complex/asynchronous operations in one place.**

## Installation

```
npm install redux-process
```

## Basic

```javascript
import {process} from 'redux-process';


async function saga(state, action, {dispatch, delay}) {
  switch (action.type) {
    case COUNTER_DECREASE:
    case COUNTER_INCREASE:
      dispatch({type: MESSAGE_SHOW});
      await delay(5000);
      dispatch({type: MESSAGE_HIDE});
      break;
  }
}

const store = createStore(reducers, {}, process({saga}));
```

## Complex

```javascript
import {process} from 'redux-process';


async function saga(state, action, {dispatch, fetch, history}) {
  switch (action.type) {
    case LOGIN_REQUEST:
      try {
        await fetch('/login', {method: 'POST', body: {
          username: action.username,
          password: action.password
        }});
        dispatch({type: LOGIN_SUCCESS});
      } catch (e) {
        dispatch({type: LOGIN_FAILURE});
      }
      break;
    case LOGIN_SUCCESS:
      history.push('/dashboard');
      break;
    case LOGIN_FAILURE:
      break;
  }
}

const store = createStore(reducers, {}, process({saga}, {fetch, history}));
```

## Testing

```javascript
import test from 'tape';


const success = () => Promise.resolve(1);
const failure = () => Promise.resolve(1).then(() => {
  throw new Error();
});

test('success test', async (assert) => {
  const result = [];

  await saga({}, {type: LOGIN_REQUEST}, {
    dispatch: (s) => result.push(s), fetch: success
  });

  assert.deepEqual(result, [
    {type: LOGIN_SUCCESS}
  ]);

  assert.end();
});

test('failure test', async (assert) => {
  const result = [];

  await saga({}, {type: LOGIN_REQUEST}, {
    dispatch: (s) => result.push(s), fetch: failure
  });

  assert.deepEqual(result, [
    {type: LOGIN_FAILURE}
  ]);

  assert.end();
});
```

## Counter example

```
npm run counter
npm run counter:test
```
