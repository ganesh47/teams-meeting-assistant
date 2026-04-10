#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
_teams_meeting_assistant_completions() {
  local cur prev
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"
  COMPREPLY=()

  if [[ ${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "linux-cli join offline-pipeline" -- "$cur") )
    return 0
  fi
}
complete -F _teams_meeting_assistant_completions teams-meeting-assistant
EOF
