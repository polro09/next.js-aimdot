<<<<<<< HEAD
// PM2 Ecosystem 설정 파일
module.exports = {
  apps: [
    {
      // Next.js 웹 애플리케이션
      name: 'aimdot-web',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 'max', // CPU 코어 수만큼 인스턴스 생성
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 로그 설정
      log_file: './logs/web-combined.log',
      out_file: './logs/web-out.log',
      error_file: './logs/web-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 자동 재시작 설정
      watch: false, // 운영 환경에서는 false
      ignore_watch: ['node_modules', 'logs', '.git'],
      // 메모리 제한
      max_memory_restart: '1G',
      // 재시작 설정
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // 기타 설정
      kill_timeout: 5000,
      listen_timeout: 8000,
      shutdown_with_message: true,
    },
    {
      // Discord Bot
      name: 'aimdot-bot',
      script: './bot/index.js',
      cwd: './',
      instances: 1, // 봇은 단일 인스턴스만 실행
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_file: './logs/bot-combined.log',
      out_file: './logs/bot-out.log',
      error_file: './logs/bot-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 자동 재시작 설정
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      // 메모리 제한
      max_memory_restart: '512M',
      // 재시작 설정
      autorestart: true,
      max_restarts: 5,
      min_uptime: '30s',
      // 기타 설정
      kill_timeout: 10000,
      listen_timeout: 8000,
      shutdown_with_message: true,
      // 크론 재시작 (매일 새벽 4시)
      cron_restart: '0 4 * * *',
    },
    {
      // 데이터베이스 백업 스크립트 (선택사항)
      name: 'aimdot-backup',
      script: './scripts/backup.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: false,
      // 크론 실행 (매일 새벽 2시)
      cron_restart: '0 2 * * *',
      env: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_file: './logs/backup-combined.log',
      out_file: './logs/backup-out.log',
      error_file: './logs/backup-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      // 로그 정리 스크립트 (선택사항)
      name: 'aimdot-log-cleaner',
      script: './scripts/clean-logs.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: false,
      // 크론 실행 (매주 일요일 새벽 3시)
      cron_restart: '0 3 * * 0',
      env: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_file: './logs/cleaner-combined.log',
      out_file: './logs/cleaner-out.log',
      error_file: './logs/cleaner-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    }
  ],

  // 배포 설정 (선택사항)
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/aimdot-dev.git',
      path: '/var/www/aimdot.dev',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/aimdot-dev.git',
      path: '/var/www/staging.aimdot.dev',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
=======
// PM2 Ecosystem 설정 파일
module.exports = {
  apps: [
    {
      // Next.js 웹 애플리케이션
      name: 'aimdot-web',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 'max', // CPU 코어 수만큼 인스턴스 생성
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 로그 설정
      log_file: './logs/web-combined.log',
      out_file: './logs/web-out.log',
      error_file: './logs/web-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 자동 재시작 설정
      watch: false, // 운영 환경에서는 false
      ignore_watch: ['node_modules', 'logs', '.git'],
      // 메모리 제한
      max_memory_restart: '1G',
      // 재시작 설정
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // 기타 설정
      kill_timeout: 5000,
      listen_timeout: 8000,
      shutdown_with_message: true,
    },
    {
      // Discord Bot
      name: 'aimdot-bot',
      script: './bot/index.js',
      cwd: './',
      instances: 1, // 봇은 단일 인스턴스만 실행
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_file: './logs/bot-combined.log',
      out_file: './logs/bot-out.log',
      error_file: './logs/bot-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 자동 재시작 설정
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      // 메모리 제한
      max_memory_restart: '512M',
      // 재시작 설정
      autorestart: true,
      max_restarts: 5,
      min_uptime: '30s',
      // 기타 설정
      kill_timeout: 10000,
      listen_timeout: 8000,
      shutdown_with_message: true,
      // 크론 재시작 (매일 새벽 4시)
      cron_restart: '0 4 * * *',
    },
    {
      // 데이터베이스 백업 스크립트 (선택사항)
      name: 'aimdot-backup',
      script: './scripts/backup.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: false,
      // 크론 실행 (매일 새벽 2시)
      cron_restart: '0 2 * * *',
      env: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_file: './logs/backup-combined.log',
      out_file: './logs/backup-out.log',
      error_file: './logs/backup-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      // 로그 정리 스크립트 (선택사항)
      name: 'aimdot-log-cleaner',
      script: './scripts/clean-logs.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: false,
      // 크론 실행 (매주 일요일 새벽 3시)
      cron_restart: '0 3 * * 0',
      env: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_file: './logs/cleaner-combined.log',
      out_file: './logs/cleaner-out.log',
      error_file: './logs/cleaner-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    }
  ],

  // 배포 설정 (선택사항)
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/aimdot-dev.git',
      path: '/var/www/aimdot.dev',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/aimdot-dev.git',
      path: '/var/www/staging.aimdot.dev',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
}