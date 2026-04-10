import test from 'node:test';
import assert from 'node:assert/strict';

import { createRuntimeOptionsFromEnv } from '../dist/config.js';

test('builds runtime options from env defaults', () => {
  delete process.env.TEAMS_HEADLESS;
  delete process.env.TEAMS_AUTO_JOIN;
  delete process.env.TEAMS_MUTE_MICROPHONE;
  delete process.env.TEAMS_DISABLE_CAMERA;
  delete process.env.TEAMS_DISPLAY_NAME;
  delete process.env.TEAMS_PROFILE_DIR;

  const config = createRuntimeOptionsFromEnv();
  assert.equal(config.displayName, 'Meeting Assistant');
  assert.equal(config.prejoin?.muteMicrophone, true);
  assert.equal(config.prejoin?.disableCamera, true);
});
