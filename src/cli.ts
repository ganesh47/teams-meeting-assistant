#!/usr/bin/env node
import { createRuntimeOptionsFromEnv } from './config.js';
import { SessionOrchestrator } from './index.js';

async function main() {
  const joinUrl = process.argv[2];

  if (!joinUrl) {
    console.error('Usage: teams-meeting-assistant <teams-join-url> [--headless] [--auto-join]');
    process.exit(1);
  }

  const envOptions = createRuntimeOptionsFromEnv();
  const runtimeOptions = {
    ...envOptions,
    headless: process.argv.includes('--headless') ? true : envOptions.headless,
    autoJoin: process.argv.includes('--auto-join') ? true : envOptions.autoJoin,
  };

  const orchestrator = new SessionOrchestrator();
  const { session, snapshot } = await orchestrator.bootstrap(joinUrl, runtimeOptions);

  console.log(
    JSON.stringify(
      {
        sessionId: session.id,
        state: snapshot.state,
        detail: snapshot.detail,
        artifacts: session.artifacts,
        runtime: session.runtime,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
