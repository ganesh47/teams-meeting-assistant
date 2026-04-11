import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const GITHUB_INSTALL_TARGET = 'github:ganesh47/teams-meeting-assistant';

export interface UpdateStatus {
  installTarget: string;
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  command?: string;
}

export async function checkForUpdates(installTarget = GITHUB_INSTALL_TARGET): Promise<UpdateStatus> {
  const currentVersion = process.env.npm_package_version || '0.1.0';

  try {
    const { stdout } = await execFileAsync('git', ['ls-remote', '--tags', 'https://github.com/ganesh47/teams-meeting-assistant.git']);
    const tags = stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split('refs/tags/')[1])
      .filter(Boolean)
      .map((tag) => tag.replace(/\^\{\}$/, ''))
      .filter((tag, index, arr) => arr.indexOf(tag) === index)
      .sort(compareSemverLike);

    const latestVersion = tags.at(-1)?.replace(/^v/, '') ?? null;
    const updateAvailable = Boolean(latestVersion && latestVersion !== currentVersion);

    return {
      installTarget,
      currentVersion,
      latestVersion,
      updateAvailable,
      command: updateAvailable ? `npm install -g ${installTarget}#v${latestVersion}` : undefined,
    };
  } catch {
    return {
      installTarget,
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
    };
  }
}

export async function performUpdate(installTarget = GITHUB_INSTALL_TARGET): Promise<{ command: string }> {
  const status = await checkForUpdates(installTarget);
  const command = status.command ?? `npm install -g ${installTarget}`;
  await execFileAsync('bash', ['-lc', command]);
  return { command };
}

function compareSemverLike(a: string, b: string): number {
  const parse = (value: string) => value.replace(/^v/, '').split('.').map((part) => Number.parseInt(part, 10) || 0);
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
