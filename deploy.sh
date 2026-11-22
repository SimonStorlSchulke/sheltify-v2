#!/usr/bin/env bash
# Deploys sheltify. Run from the repository root.
#
#   ./deploy.sh                    everything (same as "all")
#   ./deploy.sh admin              only the admin UI
#   ./deploy.sh backend clients    several parts at once
#
# Parts:
#   admin    build the admin UI and copy it to /var/www/sheltify/admin
#   backend  build the backend and restart it in the screen session "sheltify-backend"
#   clients  update the dependencies of the client sites (the sites themselves are built
#            by the backend via "Seite bauen")
#   all      all of the above
#
# admin and clients also rebuild the shared packages article-renderer and sheltify-lib.

usage() {
  sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
}

fail() {
  echo "Deploy failed: $1" >&2
  exit 1
}

# --- which parts --------------------------------------------------------------

DEPLOY_ADMIN=false
DEPLOY_BACKEND=false
DEPLOY_CLIENTS=false

[ $# -eq 0 ] && set -- all

for part in "$@"; do
  case "$part" in
    admin)   DEPLOY_ADMIN=true ;;
    backend) DEPLOY_BACKEND=true ;;
    clients) DEPLOY_CLIENTS=true ;;
    all)     DEPLOY_ADMIN=true; DEPLOY_BACKEND=true; DEPLOY_CLIENTS=true ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown part: $part" >&2; usage >&2; exit 1 ;;
  esac
done

echo "Deploying: $( $DEPLOY_ADMIN && printf 'admin ' )$( $DEPLOY_BACKEND && printf 'backend ' )$( $DEPLOY_CLIENTS && printf 'clients' )"

# --- update the code ------------------------------------------------------------

git reset --hard origin/main || fail "git reset"
git pull || fail "git pull"

# --- node based parts (admin, clients) ------------------------------------------

if $DEPLOY_ADMIN || $DEPLOY_CLIENTS; then
  # nvm is a shell function - load it when the script runs in a fresh shell
  if ! command -v nvm >/dev/null 2>&1; then
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  fi
  nvm use 24 || fail "nvm use 24"

  # shared packages used by the admin and the client sites
  npm run --prefix ./article-renderer build || fail "article-renderer build"
  tsc -p sheltify-lib || fail "sheltify-lib build"
fi

if $DEPLOY_ADMIN; then
  npm i --prefix ./sheltify-admin || fail "admin npm install"
  # build first, so a failing build leaves the deployed admin untouched
  npm run --prefix ./sheltify-admin build-prod || fail "admin build"
  sudo rm -rf /var/www/sheltify/admin
  sudo mkdir /var/www/sheltify/admin
  sudo cp -r ./sheltify-admin/dist/browser/* /var/www/sheltify/admin
  sudo cp ./sheltify-admin/.htaccess /var/www/sheltify/admin
  echo "Admin deployed."
fi

if $DEPLOY_CLIENTS; then
  npm i --prefix ./clients || fail "clients npm install"
  echo "Client dependencies updated - rebuild the sites with \"Seite bauen\" to publish changes."
fi

# --- backend ----------------------------------------------------------------------

if $DEPLOY_BACKEND; then
  # Rebuild and restart the backend, which runs in the screen session "sheltify-backend".
  # Build first, so a failing build leaves the running backend untouched.
  BACKEND_DIR="$(pwd)/sheltify-backend"
  (cd "$BACKEND_DIR" && go build .) || fail "backend build - running backend was not restarted"

  if ! screen -list | grep -q "\.sheltify-backend\b"; then
    screen -dmS sheltify-backend
    sleep 1
  fi
  screen -S sheltify-backend -X stuff $'\003'  # Ctrl+C stops the running backend
  sleep 2
  screen -S sheltify-backend -X stuff "cd \"$BACKEND_DIR\" && ./sheltify-backend"$'\n'
  echo "Backend built and restarted in screen 'sheltify-backend'."
fi

echo "Done."
