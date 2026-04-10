import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyMeetingState } from '../dist/teams/meetingStateDetector.js';

test('classifies in-meeting state', () => {
  const result = classifyMeetingState('Meeting chat People Raise your hand Leave');
  assert.equal(result.state, 'in_meeting');
});

test('classifies ended state', () => {
  const result = classifyMeetingState("You've left the meeting. Meeting ended.");
  assert.equal(result.state, 'ended');
});
