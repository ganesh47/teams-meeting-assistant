import { MeetingTarget } from '../types/index.js';

export interface ParsedTeamsJoinUrl {
  rawUrl: string;
  normalizedUrl: string;
  hostname: string;
  isTeamsHost: boolean;
}

const TEAMS_HOST_PATTERNS = ['teams.microsoft.com', 'teams.live.com'];

export function parseTeamsJoinUrl(joinUrl: string): ParsedTeamsJoinUrl {
  const parsed = new URL(joinUrl);
  const hostname = parsed.hostname.toLowerCase();
  const normalizedUrl = parsed.toString();
  const isTeamsHost = TEAMS_HOST_PATTERNS.some((host) => hostname === host || hostname.endsWith(`.${host}`));

  return {
    rawUrl: joinUrl,
    normalizedUrl,
    hostname,
    isTeamsHost,
  };
}

export function createMeetingTarget(joinUrl: string, hostType: MeetingTarget['hostType'] = 'unknown'): MeetingTarget {
  const parsed = parseTeamsJoinUrl(joinUrl);

  if (!parsed.isTeamsHost) {
    throw new Error(`Unsupported meeting host for URL: ${joinUrl}`);
  }

  return {
    joinUrl: parsed.normalizedUrl,
    hostType,
  };
}
