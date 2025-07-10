# start-dev.bat (Windows 개발 환경용)
@echo off
echo ====================================
echo   Aimdot.dev 개발 환경 시작
echo ====================================

echo [1/4] 환경 변수 확인 중...
if not exist .env (
    echo ❌ .env 파일이 없습니다. .env.example을 복사하여 .env를 생성하고 설정하세요.
    pause
    exit /b 1
)

echo [2/4] 의존성 설치 중...
call npm install

echo [3/4] 데이터베이스 설정 중...
call npm run db:generate

echo [4/4] 서비스 시작 중...
echo 🌐 웹 서버: http://localhost:3000
echo 🤖 Discord Bot 시작 중...
echo 📊 Cloudflare Tunnel 시작 중...

REM 백그라운드에서 cloudflared 터널 시작
start /B cloudflared tunnel --config cloudflared-config.yml run

REM 웹 서버와 봇을 동시에 시작
call npm run dev:all

# start-dev.sh (Linux/macOS 개발 환경용)
#!/bin/bash

echo "===================================="
echo "   Aimdot.dev 개발 환경 시작"
echo "===================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}[1/4] 환경 변수 확인 중...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env 파일이 없습니다. .env.example을 복사하여 .env를 생성하고 설정하세요.${NC}"
    echo "cp .env.example .env 명령어를 실행한 후 .env 파일을 편집하세요."
    exit 1
fi

echo -e "${BLUE}[2/4] 의존성 설치 중...${NC}"
npm install

echo -e "${BLUE}[3/4] 데이터베이스 설정 중...${NC}"
npm run db:generate

echo -e "${BLUE}[4/4] 서비스 시작 중...${NC}"
echo -e "${GREEN}🌐 웹 서버: http://localhost:3000${NC}"
echo -e "${GREEN}🤖 Discord Bot 시작 중...${NC}"
echo -e "${GREEN}📊 Cloudflare Tunnel 시작 중...${NC}"

# Cloudflare 터널을 백그라운드에서 시작
cloudflared tunnel --config cloudflared-config.yml run &

# 웹 서버와 봇을 동시에 시작
npm run dev:all

# start-production.sh (운영 환경용)
#!/bin/bash

echo "===================================="
echo "   Aimdot.dev 운영 환경 시작"
echo "===================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[1/6] 환경 변수 확인 중...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env 파일이 없습니다.${NC}"
    exit 1
fi

if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️ NODE_ENV가 production으로 설정되지 않았습니다.${NC}"
fi

echo -e "${BLUE}[2/6] 의존성 설치 중...${NC}"
npm ci --only=production

echo -e "${BLUE}[3/6] 애플리케이션 빌드 중...${NC}"
npm run build

echo -e "${BLUE}[4/6] 데이터베이스 마이그레이션 중...${NC}"
npm run db:push

echo -e "${BLUE}[5/6] PM2로 서비스 시작 중...${NC}"

# PM2가 설치되어 있지 않으면 설치
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2를 설치합니다...${NC}"
    npm install -g pm2
fi

# PM2 설정 파일로 시작
pm2 start ecosystem.config.js

echo -e "${BLUE}[6/6] Cloudflare Tunnel 시작 중...${NC}"
# Cloudflare 터널을 서비스로 시작
sudo cloudflared service install
sudo systemctl start cloudflared

echo -e "${GREEN}✅ 모든 서비스가 시작되었습니다!${NC}"
echo -e "${GREEN}🌐 웹사이트: https://aimdot.dev${NC}"
echo -e "${GREEN}📊 PM2 모니터링: pm2 monit${NC}"
echo -e "${GREEN}📋 PM2 로그: pm2 logs${NC}"

# stop-all.sh (모든 서비스 중지)
#!/bin/bash

echo "===================================="
echo "   Aimdot.dev 서비스 중지"
echo "===================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}모든 서비스를 중지합니다...${NC}"

# PM2 프로세스 중지
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 프로세스 중지 중...${NC}"
    pm2 delete all
fi

# Cloudflare 터널 중지
echo -e "${YELLOW}Cloudflare Tunnel 중지 중...${NC}"
pkill -f cloudflared

# Node.js 프로세스 중지
echo -e "${YELLOW}Node.js 프로세스 중지 중...${NC}"
pkill -f "node"

echo -e "${GREEN}✅ 모든 서비스가 중지되었습니다.${NC}"

# check-status.sh (서비스 상태 확인)
#!/bin/bash

echo "===================================="
echo "   Aimdot.dev 서비스 상태 확인"
echo "===================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 웹 서버 상태 확인
echo -e "${YELLOW}웹 서버 상태:${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ 웹 서버 실행 중 (http://localhost:3000)${NC}"
else
    echo -e "${RED}❌ 웹 서버 중지됨${NC}"
fi

# Discord Bot 상태 확인 (포트 기반)
echo -e "${YELLOW}Discord Bot 상태:${NC}"
if pgrep -f "bot.*index.js" > /dev/null; then
    echo -e "${GREEN}✅ Discord Bot 실행 중${NC}"
else
    echo -e "${RED}❌ Discord Bot 중지됨${NC}"
fi

# Cloudflare Tunnel 상태 확인
echo -e "${YELLOW}Cloudflare Tunnel 상태:${NC}"
if pgrep -f cloudflared > /dev/null; then
    echo -e "${GREEN}✅ Cloudflare Tunnel 실행 중${NC}"
else
    echo -e "${RED}❌ Cloudflare Tunnel 중지됨${NC}"
fi

# PM2 상태 확인
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 프로세스 상태:${NC}"
    pm2 status
fi

# 포트 사용 상황 확인
echo -e "${YELLOW}포트 사용 상황:${NC}"
netstat -tlnp | grep -E ':(3000|3001|8080)'

echo "===================================="