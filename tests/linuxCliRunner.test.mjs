import test from 'node:test';
import assert from 'node:assert/strict';

import { runLinuxCliJoinAndTranscript } from '../dist/core/linuxCliRunner.js';

test('linux cli runner export exists', async () => {
  assert.equal(typeof runLinuxCliJoinAndTranscript, 'function');
});
