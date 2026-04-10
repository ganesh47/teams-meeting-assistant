import path from 'node:path';

import { AudioCaptureOptions, JoinFlowOptions } from './types/index.js';

export function createRuntimeOptionsFromEnv(): JoinFlowOptions {
  const profileDir = process.env.TEAMS_PROFILE_DIR
    ? path.resolve(process.env.TEAMS_PROFILE_DIR)
    : '.profiles/teams-personal';

  return {
    headless: process.env.TEAMS_HEADLESS === '1',
    profileDir,
    displayName: process.env.TEAMS_DISPLAY_NAME || 'Meeting Assistant',
    autoJoin: process.env.TEAMS_AUTO_JOIN === '1',
    prejoin: {
      muteMicrophone: process.env.TEAMS_MUTE_MICROPHONE !== '0',
      disableCamera: process.env.TEAMS_DISABLE_CAMERA !== '0',
    },
  };
}

export function createAudioOptionsFromEnv(): AudioCaptureOptions {
  return {
    mode: process.env.TEAMS_AUDIO_MODE === 'browser_tab' ? 'browser_tab' : process.env.TEAMS_AUDIO_MODE === 'system_loopback' ? 'system_loopback' : 'unknown',
    fixturePath: process.env.TEAMS_AUDIO_FIXTURE_PATH || undefined,
    sampleRateHz: process.env.TEAMS_AUDIO_SAMPLE_RATE ? Number(process.env.TEAMS_AUDIO_SAMPLE_RATE) : 16000,
    channels: process.env.TEAMS_AUDIO_CHANNELS ? Number(process.env.TEAMS_AUDIO_CHANNELS) : 1,
    chunkDurationMs: process.env.TEAMS_AUDIO_CHUNK_MS ? Number(process.env.TEAMS_AUDIO_CHUNK_MS) : 1000,
  };
}
