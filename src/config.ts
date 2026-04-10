import path from 'node:path';

import { JoinFlowOptions } from './types/index.js';

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
