#!/bin/bash -e

function main () {
  if [ -z "${1}" ]; then
    default
  else
    for fn in "${@}"; do
      if [ "$(type -t "${fn}")" = "function" ]; then
        "${fn}"
      else 
        echo "scripts.dev.sh :: ERROR :: function ${fn} does not exist. Exiting."
        exit 1
      fi
    done
  fi
}

# #############################################################################
#
# VARIABLES
#
# #############################################################################

# N/A

# #############################################################################
#
# WORKFLOWS
#
# #############################################################################

function default () {
  deps::nuke
  deps
  compile::nuke
  compile::watch
}

# #############################################################################
#
# COMMANDS
#
# #############################################################################

function deps::nuke () {
  rm -rf node_modules
}

function deps () {
  npm install
}

function lint () {
  npx eslint --max-warnings=0 .
}

function format () {
  npx prettier --check .
}

function typecheck () {
  npx tsc --noEmit
}

function compile::nuke () {
  rm -rf build
}

function compile () {
  npx vite build
}

function compile::watch () {
  npm link ../xmtp-js
  npx vite
}

# #############################################################################
#
# HELPERS
#
# #############################################################################

# N/A

# #############################################################################
#
# EXECUTE MAIN
#
# #############################################################################

[[ "${BASH_SOURCE[0]}" = "${0}" ]] && main "${@}"