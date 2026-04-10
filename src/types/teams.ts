export interface PrejoinPreferences {
  muteMicrophone: boolean;
  disableCamera: boolean;
}

export interface JoinFlowOptions {
  headless?: boolean;
  profileDir?: string;
  displayName?: string;
  autoJoin?: boolean;
  prejoin?: PrejoinPreferences;
}
