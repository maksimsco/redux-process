import {
  COUNTER_DECREASE,
  COUNTER_INCREASE
} from '../redux/counter';
import {
  MESSAGE_SHOW,
  MESSAGE_HIDE
} from '../redux/message';


export default async function process({counter}, action, {dispatch, delay}) {
  switch (action.type) {
    case COUNTER_DECREASE:
    case COUNTER_INCREASE:
      if (counter.total === 3) {
        dispatch({type: MESSAGE_SHOW});
        await delay(5000);
        dispatch({type: MESSAGE_HIDE});
      }
      break;
  }
}

export default async function process(action, {dispatch, delay}) {
  switch (action.type) {
    case COUNTER_DECREASE:
    case COUNTER_INCREASE:
      if (++this.state === 3) {
        dispatch({type: MESSAGE_SHOW});
        await delay(5000);
        dispatch({type: MESSAGE_HIDE});
      }
      break;
  }
}
