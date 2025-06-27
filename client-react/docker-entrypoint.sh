#!/bin/sh
# This script runs inside the Docker container to install npm dependencies in a way that's compatible with Windows hosts
echo "Installing dependencies..."
# 전역 패키지로 vite 설치
npm install -g vite
# 로컬 의존성 설치
npm install --no-optional

echo "Starting Vite dev server..."
# 전역 vite 명령 사용
vite --host 0.0.0.0
