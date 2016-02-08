export function TimeoutException(message) {
  this.name = 'TimeoutException';
  this.message = message;
  this.stack = (new Error()).stack;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeout(ms) {
  return new Promise((resolve, reject) => setTimeout(() => {
    reject(new TimeoutException(`The timeout period of ${ms}ms elapsed.`));
  }, ms));
}


export function process(collection={}, dependencies={}) {
  const sagas = Object.values(collection).filter((s) => typeof s === 'function');

  return (createStore) => (...args) => {
    const store = createStore(...args);

    function dispatch(action) {
      store.dispatch(action);

      const promises = [];
      for (const saga of sagas) {
        const state = store.getState();
        const promise = saga(state, action, {
          delay, timeout, ...dependencies, dispatch
        });
        promises.push(promise);
      }

      return Promise.all(promises).then(() => action);
    }

    return {...store, dispatch};
  };
}
