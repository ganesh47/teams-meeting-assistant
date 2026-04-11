import test from 'node:test';
import assert from 'node:assert/strict';

import { buildJoinStatusReport } from '../dist/core/statusReporter.js';

test('builds join status report for prejoin state', () => {
  const report = buildJoinStatusReport({
    launched: true,
    redirected: true,
    joinAttempted: true,
    finalState: 'prejoin',
    transcriptionActive: false,
    detail: 'Detected prejoin screen.',
  });

  assert.deepEqual(report.checkpoints, ['launch_ok', 'redirect_ok', 'prejoin_detected', 'join_attempted']);
});
