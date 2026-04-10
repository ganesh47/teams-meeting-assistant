#!/usr/bin/env node
import { SessionOrchestrator } from './index.js';

async function main() {
  const joinUrl = process.argv[2];

  if (!joinUrl) {
    console.error('Usage: teams-meeting-assistant <teams-join-url>');
    process.exit(1);
  }

  const orchestrator = new SessionOrchestrator();
  const headless = process.argv.includes('--headless');
  const { session, snapshot } = await orchestrator.bootstrap(joinUrl, {
    headless,
    profileDir: '.profiles/teams-personal',
    prejoin: {
      muteMicrophone: true,
      disableCamera: true,
    },
  });

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
