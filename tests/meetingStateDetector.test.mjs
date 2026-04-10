import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyMeetingState } from '../dist/teams/meetingStateDetector.js';

test('classifies prejoin state', () => {
  const result = classifyMeetingState('Join now Continue on this browser Enter your name');
  assert.equal(result.state, 'prejoin');
});

test('classifies lobby state', () => {
  const result = classifyMeetingState("We've let people in the meeting know you're waiting.");
  assert.equal(result.state, 'lobby');
});

test('classifies failed state', () => {
  const result = classifyMeetingState("Sorry, but there was a problem reaching this app.");
  assert.equal(result.state, 'failed');
});
