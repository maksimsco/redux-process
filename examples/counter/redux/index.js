import {combineReducers} from 'redux';

import message from './message';
import counter from './counter';


export default combineReducers({
  message,
  counter
});
