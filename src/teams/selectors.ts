export const TEAMS_SELECTORS = {
  continueInBrowserButtons: [
    'button:has-text("Continue on this browser")',
    'button:has-text("Continue on browser")',
  ],
  joinNowButtons: [
    'button:has-text("Join now")',
    '[data-tid="prejoin-join-button"]',
    '[data-tid="joinOnWeb"]',
  ],
  micButtons: [
    '[data-tid="toggle-mute"]',
    'button[aria-label*="Microphone"]',
    'button[title*="Microphone"]',
  ],
  cameraButtons: [
    '[data-tid="toggle-video"]',
    'button[aria-label*="Camera"]',
    'button[title*="Camera"]',
  ],
  nameInput: [
    'input[placeholder*="name" i]',
    'input[data-tid="prejoin-display-name-input"]',
    'input[type="text"]',
  ],
} as const;
