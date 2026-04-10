import test from 'node:test';
import assert from 'node:assert/strict';

import { checkForUpdates } from '../dist/update.js';

test('update checker export exists', async () => {
  const result = await checkForUpdates('definitely-not-a-real-package-name-123');
  assert.equal(typeof result.updateAvailable, 'boolean');
  assert.equal(result.packageName, 'definitely-not-a-real-package-name-123');
});
