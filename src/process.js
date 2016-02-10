import {delay, timeout} from './common';


export function manage(collection={}, dependencies={}) {
  const sagas = Object.values(collection).filter((s) => typeof s === 'function');

  return (createStore) => (...args) => {
    const store = createStore(...args);

    function dispatch(action) {
      const reducers = Promise.resolve(store.dispatch(action));

      const promises = sagas.map((saga) => saga(store.getState(), action, {
        delay, timeout, ...dependencies, dispatch
      }));

      return reducers.then(() => Promise.all(promises)).then(() => action);
    }

    return {...store, dispatch};
  };
}
