import test from 'tape';
import reducer, {
  decrease,
  increase
} from '../redux/counter';


test('counter reducer', (assert) => {
  assert.plan(4);

  const result1 = reducer({count: 2, total: 2}, decrease());
  assert.equal(1, result1.count, 'reduce count on COUNTER_DECREASE');
  assert.equal(3, result1.total, 'reduce total on COUNTER_DECREASE');

  const result2 = reducer({count: 2, total: 2}, increase());
  assert.equal(3, result2.count, 'reduce count on COUNTER_INCREASE');
  assert.equal(3, result2.total, 'reduce total on COUNTER_INCREASE');
});
