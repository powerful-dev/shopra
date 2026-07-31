#!/bin/bash

set -e

############################################
# CONFIG
############################################

PROJECT_DIR="/var/www/user221642/data/www/shopra.fast-shop.com.ua"
APP_DIR="$PROJECT_DIR/src"
PHP="/opt/alt/php84/usr/bin/php"
COMPOSER="$APP_DIR/composer.phar"

############################################
# COLORS
############################################

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

log() {
    echo -e "${GREEN}==> $1${NC}"
}

warn() {
    echo -e "${YELLOW}==> $1${NC}"
}

error() {
    echo -e "${RED}==> $1${NC}"
}

log "Deploy started"

cd "$PROJECT_DIR"

log "Checking for updates..."

git fetch origin main

LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    warn "No new commits. Deployment skipped."
    exit 0
fi

log "New commit found:"

echo "Current: $LOCAL_COMMIT"
echo "Remote:  $REMOTE_COMMIT"

log "Pulling latest changes..."

git pull --ff-only origin main

cd "$APP_DIR"

if [ ! -f "$COMPOSER" ]; then
    error "composer.phar not found: $COMPOSER"
    exit 1
fi

log "Installing composer dependencies..."

$PHP "$COMPOSER" install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction

############################################
# NODE
############################################

log "Loading NVM..."

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm use 22 >/dev/null

log "Installing npm dependencies..."

if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

log "Building frontend..."

export GOMAXPROCS=1
export UV_THREADPOOL_SIZE=1
export CI=true

npm run build

############################################
# LARAVEL
############################################

log "Running migrations..."

$PHP artisan migrate --force

log "Clearing caches..."

$PHP artisan optimize:clear

log "Caching config..."

$PHP artisan config:cache

log "Caching routes..."

$PHP artisan route:cache

log "Caching views..."

$PHP artisan view:cache

############################################
# DONE
############################################

log "Deploy completed successfully!"