import test from 'node:test';
import assert from 'node:assert/strict';

import { runTui } from '../dist/tui.js';

test('tui export exists', () => {
  assert.equal(typeof runTui, 'function');
});
