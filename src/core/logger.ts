import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export class SessionLogger {
  constructor(private readonly filePath: string) {}

  async log(message: string, data?: unknown): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      message,
      ...(data ? { data } : {}),
    }) + '\n';
    await appendFile(this.filePath, line, 'utf8');
  }
}
