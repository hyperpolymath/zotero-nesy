#!/bin/sh
# STATE.scm Auto-Updater
# Automatically updates STATE.scm metadata on git commits
#
# Usage: ./scripts/update-state.sh [--no-test]
#
# "What can be said at all can be said clearly."

STATE_FILE="STATE.scm"

# Get current timestamp
get_timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Get current git branch
get_branch() {
  git branch --show-current 2>/dev/null || echo "unknown"
}

# Count ReScript files
count_res_files() {
  find src -name "*.res" 2>/dev/null | wc -l | tr -d ' '
}

# Update the STATE.scm file
update_state() {
  TIMESTAMP=$(get_timestamp)
  BRANCH=$(get_branch)
  RES_COUNT=$(count_res_files)

  echo "Updating STATE.scm..."
  echo "  Timestamp: $TIMESTAMP"
  echo "  Branch: $BRANCH"
  echo "  ReScript files: $RES_COUNT"

  # Use sed to update fields (POSIX compatible)
  if [ -f "$STATE_FILE" ]; then
    # Update last-updated
    sed -i.bak "s/(last-updated \. \"[^\"]*\")/(last-updated . \"$TIMESTAMP\")/" "$STATE_FILE"

    # Update branch
    sed -i.bak "s/(branch \. \"[^\"]*\")/(branch . \"$BRANCH\")/" "$STATE_FILE"

    # Clean up backup file
    rm -f "${STATE_FILE}.bak"

    echo "STATE.scm updated successfully"
  else
    echo "Warning: $STATE_FILE not found"
    exit 1
  fi
}

# Main
update_state
