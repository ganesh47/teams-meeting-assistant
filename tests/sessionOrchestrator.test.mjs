import test from 'node:test';
import assert from 'node:assert/strict';

import { SessionOrchestrator } from '../dist/index.js';

test('creates session bootstrap artifacts metadata', async () => {
  const orchestrator = new SessionOrchestrator();
  const session = await orchestrator.bootstrap({
    joinUrl: 'https://teams.microsoft.com/l/meetup-join/example',
    hostType: 'personal',
  });

  assert.equal(session.target.hostType, 'personal');
  assert.equal(typeof session.id, 'string');
  assert.ok(session.artifacts.transcriptJsonl.endsWith('transcript.jsonl'));
});
