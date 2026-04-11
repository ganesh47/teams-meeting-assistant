import test from 'node:test';
import assert from 'node:assert/strict';

import { checkForUpdates } from '../dist/update.js';

test('update checker export exists', async () => {
  const result = await checkForUpdates('github:ganesh47/teams-meeting-assistant');
  assert.equal(typeof result.updateAvailable, 'boolean');
  assert.equal(result.installTarget, 'github:ganesh47/teams-meeting-assistant');
});
