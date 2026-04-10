import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface UpdateStatus {
  packageName: string;
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  command?: string;
}

export async function checkForUpdates(packageName = 'teams-meeting-assistant'): Promise<UpdateStatus> {
  const currentVersion = process.env.npm_package_version || '0.1.0';

  try {
    const { stdout } = await execFileAsync('npm', ['view', packageName, 'version']);
    const latestVersion = stdout.trim() || null;
    const updateAvailable = Boolean(latestVersion && latestVersion !== currentVersion);

    return {
      packageName,
      currentVersion,
      latestVersion,
      updateAvailable,
      command: updateAvailable ? `npm install -g ${packageName}@latest` : undefined,
    };
  } catch {
    return {
      packageName,
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
    };
  }
}

export async function performUpdate(packageName = 'teams-meeting-assistant'): Promise<{ command: string }> {
  const command = `npm install -g ${packageName}@latest`;
  await execFileAsync('bash', ['-lc', command]);
  return { command };
}
