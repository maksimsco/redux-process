export const COUNTER_DECREASE = 'COUNTER_DECREASE';
export const COUNTER_INCREASE = 'COUNTER_INCREASE';


function count(state=0, action) {
  switch (action.type) {
    case COUNTER_DECREASE:
      return state - 1;
    case COUNTER_INCREASE:
      return state + 1;
    default:
      return state;
  }
}

function total(state=0, action) {
  switch (action.type) {
    case COUNTER_DECREASE:
    case COUNTER_INCREASE:
      return state + 1;
    default:
      return state;
  }
}

export default function reducer(state, action) {
  return {
    count: count(state ? state.count : state, action),
    total: total(state ? state.total : state, action)
  };
}

export function decrease() {
  return {
    type: COUNTER_DECREASE
  };
}

export function increase() {
  return {
    type: COUNTER_INCREASE
  };
}
