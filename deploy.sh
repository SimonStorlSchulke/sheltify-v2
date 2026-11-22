git reset --hard origin/main
git pull

nvm use 24
npm run --prefix ./article-renderer build
tsc -p sheltify-lib

npm i --prefix ./sheltify-admin
npm run --prefix ./sheltify-admin build-prod
sudo rm -rf /var/www/sheltify/admin
sudo mkdir /var/www/sheltify/admin
sudo cp -r ./sheltify-admin/dist/browser/* /var/www/sheltify/admin
sudo cp ./sheltify-admin/.htaccess /var/www/sheltify/admin

# Rebuild and restart the backend, which runs in the screen session "sheltify-backend".
# Build first, so a failing build leaves the running backend untouched.
BACKEND_DIR="$(pwd)/sheltify-backend"
if (cd "$BACKEND_DIR" && go build .); then
  if ! screen -list | grep -q "\.sheltify-backend\b"; then
    screen -dmS sheltify-backend
    sleep 1
  fi
  screen -S sheltify-backend -X stuff $'\003'  # Ctrl+C stops the running backend
  sleep 2
  screen -S sheltify-backend -X stuff "cd \"$BACKEND_DIR\" && ./sheltify-backend"$'\n'
  echo "backend built and restarted in screen 'sheltify-backend'."
else
  echo "Backend-Build failed - running backend was not restarted." >&2
  exit 1
fi
