// bot/events/ready.js - 봇 준비 이벤트
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const { logger, DatabaseUtils } = require('../index.js');
        
        try {
            logger.success(`${client.user.tag}이(가) 준비되었습니다!`);
            logger.info(`서버 수: ${client.guilds.cache.size}`);
            logger.info(`사용자 수: ${client.users.cache.size}`);
            logger.info(`채널 수: ${client.channels.cache.size}`);
            
            // 봇 상태 메시지 설정
            const activities = [
                { name: 'Aimdot.dev | 게임 파티 관리', type: ActivityType.Playing },
                { name: `${client.guilds.cache.size}개 서버 관리 중`, type: ActivityType.Watching },
                { name: '/도움말 | 명령어 확인', type: ActivityType.Listening },
                { name: 'aimdot.dev | 웹 대시보드', type: ActivityType.Playing }
            ];
            
            let activityIndex = 0;
            
            // 초기 상태 설정
            client.user.setActivity(activities[activityIndex].name, { 
                type: activities[activityIndex].type 
            });
            
            // 상태 메시지 로테이션 (30초마다)
            setInterval(() => {
                activityIndex = (activityIndex + 1) % activities.length;
                client.user.setActivity(activities[activityIndex].name, { 
                    type: activities[activityIndex].type 
                });
            }, 30000);
            
            // 봇 상태를 웹 서버에 전송
            await updateWebServerStatus(client);
            
            // 주기적으로 상태 업데이트 (30초마다)
            setInterval(async () => {
                await updateWebServerStatus(client);
            }, 30000);
            
            // 서버별 초기화 확인
            for (const [guildId, guild] of client.guilds.cache) {
                try {
                    // 서버 정보 데이터베이스에 저장/업데이트
                    await DatabaseUtils.initializeGuild({
                        guildId: guild.id,
                        guildName: guild.name,
                        guildIcon: guild.iconURL(),
                        ownerId: guild.ownerId,
                        memberCount: guild.memberCount,
                        region: guild.preferredLocale,
                        features: guild.features
                    });
                    
                    logger.database(`서버 동기화 완료: ${guild.name} (${guild.id})`);
                } catch (error) {
                    logger.error(`서버 동기화 실패: ${guild.name} - ${error.message}`);
                }
            }
            
            // 시작 시 정리 작업 실행
            await performStartupCleanup();
            
            // 주기적인 정리 작업 설정 (1시간마다)
            setInterval(async () => {
                await performScheduledCleanup();
            }, 60 * 60 * 1000);
            
            logger.success('봇 초기화가 완료되었습니다!');
            
        } catch (error) {
            logger.error(`Ready 이벤트 처리 중 오류: ${error.message}`);
        }
    }
};

// 웹 서버에 봇 상태 업데이트
async function updateWebServerStatus(client) {
    const { logger } = require('../index.js');
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bot/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BOT_API_SECRET}`
            },
            body: JSON.stringify({
                status: 'online',
                uptime: process.uptime(),
                guilds: client.guilds.cache.size,
                users: client.users.cache.size,
                latency: client.ws.ping,
                version: require('../../package.json').version || '1.0.0'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        logger.debug('웹 서버 상태 업데이트 성공');
        
    } catch (error) {
        logger.error(`웹 서버 상태 업데이트 실패: ${error.message}`);
    }
}

// 시작 시 정리 작업
async function performStartupCleanup() {
    const { logger } = require('../index.js');
    
    try {
        logger.info('시작 정리 작업 시작...');
        
        // 만료된 임시 데이터 정리
        await cleanupExpiredData();
        
        // 오래된 로그 정리
        await cleanupOldLogs();
        
        // 캐시 초기화
        await resetCache();
        
        logger.success('시작 정리 작업 완료');
        
    } catch (error) {
        logger.error(`시작 정리 작업 중 오류: ${error.message}`);
    }
}

// 예약된 정리 작업
async function performScheduledCleanup() {
    const { logger } = require('../index.js');
    
    try {
        logger.info('예약된 정리 작업 시작...');
        
        // 만료된 파티 정리
        await cleanupExpiredParties();
        
        // 비활성 사용자 세션 정리
        await cleanupInactiveSessions();
        
        // 임시 파일 정리
        await cleanupTempFiles();
        
        logger.success('예약된 정리 작업 완료');
        
    } catch (error) {
        logger.error(`예약된 정리 작업 중 오류: ${error.message}`);
    }
}

// 만료된 데이터 정리
async function cleanupExpiredData() {
    const { logger, DatabaseUtils } = require('../index.js');
    
    try {
        const result = await DatabaseUtils.cleanupExpiredData();
        logger.info(`만료된 데이터 ${result.deletedCount}개 정리됨`);
    } catch (error) {
        logger.error(`만료된 데이터 정리 실패: ${error.message}`);
    }
}

// 오래된 로그 정리
async function cleanupOldLogs() {
    const { logger, DatabaseUtils } = require('../index.js');
    
    try {
        // 30일 이상 된 로그 삭제
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const result = await DatabaseUtils.cleanupOldLogs(thirtyDaysAgo);
        logger.info(`오래된 로그 ${result.deletedCount}개 정리됨`);
    } catch (error) {
        logger.error(`로그 정리 실패: ${error.message}`);
    }
}

// 캐시 초기화
async function resetCache() {
    const { logger } = require('../index.js');
    
    try {
        if (global.gc) {
            global.gc();
            logger.info('가비지 컬렉션 실행됨');
        }
        
        logger.info('캐시 초기화 완료');
    } catch (error) {
        logger.error(`캐시 초기화 실패: ${error.message}`);
    }
}

// 만료된 파티 정리
async function cleanupExpiredParties() {
    const { logger, DatabaseUtils } = require('../index.js');
    
    try {
        const result = await DatabaseUtils.cleanupExpiredParties();
        logger.info(`만료된 파티 ${result.deletedCount}개 정리됨`);
    } catch (error) {
        logger.error(`파티 정리 실패: ${error.message}`);
    }
}

// 비활성 세션 정리
async function cleanupInactiveSessions() {
    const { logger, DatabaseUtils } = require('../index.js');
    
    try {
        // 7일 이상 비활성 세션 정리
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const result = await DatabaseUtils.cleanupInactiveSessions(sevenDaysAgo);
        logger.info(`비활성 세션 ${result.deletedCount}개 정리됨`);
    } catch (error) {
        logger.error(`세션 정리 실패: ${error.message}`);
    }
}

// 임시 파일 정리
async function cleanupTempFiles() {
    const { logger } = require('../index.js');
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
        const tempDir = path.join(__dirname, '../../temp');
        
        // temp 디렉토리가 존재하는지 확인
        try {
            await fs.access(tempDir);
        } catch {
            // 디렉토리가 없으면 종료
            return;
        }
        
        // 24시간 이상 된 파일 삭제
        const files = await fs.readdir(tempDir);
        const now = Date.now();
        let deletedCount = 0;
        
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);
            
            if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
                await fs.unlink(filePath);
                deletedCount++;
            }
        }
        
        if (deletedCount > 0) {
            logger.info(`임시 파일 ${deletedCount}개 정리됨`);
        }
    } catch (error) {
        logger.error(`임시 파일 정리 실패: ${error.message}`);
    }
}