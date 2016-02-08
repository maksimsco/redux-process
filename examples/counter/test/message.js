import test from 'tape';
import reducer, {
  show,
  hide
} from '../redux/message';
import {
  decrease,
  increase
} from '../redux/counter';
import saga from '../sagas/message';


test('message reducer', (assert) => {
  assert.plan(2);

  assert.equal(reducer(null, show()), true, 'handle MESSAGE_SHOW action');
  assert.equal(reducer(null, hide()), false, 'handle MESSAGE_HIDE action');
});

test('message saga', async (assert) => {
  let result = [];

  const common = {
    dispatch: (s) => result.push(s), delay: (ms) => result.push(ms)
  };

  await saga({counter: {total: 2}}, increase(), common);
  assert.deepEqual(result, [], 'nothing when clicks 2');
  result = [];

  await saga({counter: {total: 4}}, increase(), common);
  assert.deepEqual(result, [], 'nothing when clicks 4');
  result = [];

  await saga({counter: {total: 3}}, decrease(), common);
  assert.deepEqual(result, [
    show(),
    5000,
    hide()
  ], 'dispatch MESSAGE_SHOW and MESSAGE_HIDE on 3 clicks when COUNTER_DECREASE');
  result = [];

  await saga({counter: {total: 3}}, increase(), common);
  assert.deepEqual(result, [
    show(),
    5000,
    hide()
  ], 'dispatch MESSAGE_SHOW and MESSAGE_HIDE on 3 clicks when COUNTER_INCREASE');
  result = [];

  assert.end();
});
