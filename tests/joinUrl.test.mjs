import test from 'node:test';
import assert from 'node:assert/strict';

import { createMeetingTarget, parseTeamsJoinUrl } from '../dist/teams/joinUrl.js';

test('parses supported Teams join URL', () => {
  const parsed = parseTeamsJoinUrl('https://teams.microsoft.com/l/meetup-join/abc');
  assert.equal(parsed.isTeamsHost, true);
  assert.equal(parsed.hostname, 'teams.microsoft.com');
});

test('creates meeting target for supported host', () => {
  const target = createMeetingTarget('https://teams.live.com/meet/123');
  assert.equal(target.joinUrl, 'https://teams.live.com/meet/123');
});

test('throws for unsupported host', () => {
  assert.throws(() => createMeetingTarget('https://example.com/meeting/123'));
});
