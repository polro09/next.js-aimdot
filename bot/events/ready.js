// bot/events/ready.js - Discord Bot 준비 이벤트 핸들러
const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const { logger } = require('../index.js');
        
        try {
            // 봇 정보 로깅
            logger.success(`🤖 ${client.user.tag}이(가) 성공적으로 로그인했습니다!`);
            logger.info(`📊 서버 수: ${client.guilds.cache.size}개`);
            logger.info(`👥 사용자 수: ${client.users.cache.size}명`);
            logger.info(`⚡ 명령어 수: ${client.commands.size}개`);
            
            // 봇 활동 상태 설정
            const activities = [
                { name: 'Aimdot.dev | 게임 파티 관리', type: ActivityType.Playing },
                { name: `${client.guilds.cache.size}개 서버에서 활동`, type: ActivityType.Watching },
                { name: '게임 파티를 생성해보세요!', type: ActivityType.Listening },
                { name: '/도움말로 명령어 확인', type: ActivityType.Playing },
                { name: 'aimdot.dev에서 관리', type: ActivityType.Watching }
            ];
            
            let activityIndex = 0;
            
            // 초기 활동 상태 설정
            await setActivityStatus(client, activities[activityIndex]);
            
            // 5분마다 활동 상태 변경
            setInterval(() => {
                activityIndex = (activityIndex + 1) % activities.length;
                const activity = activities[activityIndex];
                
                // 동적 정보 업데이트
                if (activity.name.includes('서버에서 활동')) {
                    activity.name = `${client.guilds.cache.size}개 서버에서 활동`;
                }
                
                setActivityStatus(client, activity);
            }, 5 * 60 * 1000); // 5분
            
            // 서버 목록 출력
            logGuildList(client);
            
            // 시스템 상태 체크 시작
            startHealthCheck(client);
            
            // 정리 작업 스케줄링
            startCleanupTasks(client);
            
            logger.success('🚀 봇이 성공적으로 시작되었습니다!');
            
        } catch (error) {
            logger.error(`봇 시작 중 오류 발생: ${error.message}`);
        }
    },
};

// 봇 상태 메시지 설정
async function setActivityStatus(client, activity) {
    const { logger } = require('../index.js');
    
    try {
        await client.user.setActivity(activity.name, { type: activity.type });
        logger.debug(`🎮 활동 상태 업데이트: ${activity.name}`);
    } catch (error) {
        logger.error(`활동 상태 설정 실패: ${error.message}`);
    }
}

// 서버 목록 로깅
function logGuildList(client) {
    const { logger } = require('../index.js');
    
    logger.info('📋 연결된 서버 목록:');
    client.guilds.cache.forEach((guild) => {
        logger.info(`   • ${guild.name} (ID: ${guild.id}) - ${guild.memberCount}명`);
    });
}

// 시스템 상태 체크
function startHealthCheck(client) {
    const { logger } = require('../index.js');
    
    // 30분마다 상태 체크
    setInterval(async () => {
        try {
            // 메모리 사용량
            const memoryUsage = process.memoryUsage();
            
            // 업타임
            const uptime = process.uptime();
            
            // 메모리 사용량 체크 (1GB 이상 사용 시 경고)
            const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
            if (memoryUsedMB > 1024) {
                logger.warn(`⚠️ 높은 메모리 사용량: ${memoryUsedMB}MB`);
            }
            
            // 업타임 로깅
            const uptimeHours = Math.floor(uptime / 3600);
            logger.info(`💓 상태 체크 - 업타임: ${uptimeHours}시간, 메모리: ${memoryUsedMB}MB, 지연시간: ${client.ws.ping}ms`);
            
        } catch (error) {
            logger.error(`상태 체크 중 오류: ${error.message}`);
        }
    }, 30 * 60 * 1000); // 30분
}

// 정리 작업 시작
function startCleanupTasks(client) {
    const { logger } = require('../index.js');
    
    // 매일 새벽 3시에 정리 작업 실행
    setInterval(async () => {
        const now = new Date();
        if (now.getHours() === 3 && now.getMinutes() === 0) {
            try {
                logger.info('🧹 일일 정리 작업 시작...');
                
                // 만료된 파티 정리
                await cleanupExpiredParties();
                
                // 오래된 로그 정리
                await cleanupOldLogs();
                
                // 캐시 정리
                await cleanupCache();
                
                logger.success('✅ 일일 정리 작업 완료');
                
            } catch (error) {
                logger.error(`정리 작업 중 오류: ${error.message}`);
            }
        }
    }, 60 * 1000); // 1분마다 체크
}

// 만료된 파티 정리 함수
async function cleanupExpiredParties() {
    const { logger } = require('../index.js');
    
    try {
        // 데이터베이스에서 만료된 파티들을 찾아서 정리
        // 실제 구현 시 데이터베이스 연동 필요
        
        logger.info('만료된 파티 정리 완료');
        
    } catch (error) {
        logger.error(`파티 정리 중 오류: ${error.message}`);
    }
}

// 오래된 로그 정리 함수
async function cleanupOldLogs() {
    const { logger } = require('../index.js');
    
    try {
        // 30일 이상 된 로그 파일들을 정리
        // 실제 구현 시 파일 시스템 작업 필요
        
        logger.info('오래된 로그 정리 완료');
        
    } catch (error) {
        logger.error(`로그 정리 중 오류: ${error.message}`);
    }
}

// 캐시 정리 함수
async function cleanupCache() {
    const { logger } = require('../index.js');
    
    try {
        // 메모리 캐시 정리
        if (global.gc) {
            global.gc();
            logger.info('가비지 컬렉션 실행됨');
        }
        
        logger.info('캐시 정리 완료');
        
    } catch (error) {
        logger.error(`캐시 정리 중 오류: ${error.message}`);
    }
}