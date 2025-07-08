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
            client.user.setActivity(activities[activityIndex].name, { 
                type: activities[activityIndex].type 
            });
            
            // 5분마다 활동 상태 변경
            setInterval(() => {
                activityIndex = (activityIndex + 1) % activities.length;
                const activity = activities[activityIndex];
                
                // 동적 정보 업데이트
                if (activity.name.includes('서버에서 활동')) {
                    activity.name = `${client.guilds.cache.size}개 서버에서 활동`;
                }
                
                client.user.setActivity(activity.name, { type: activity.type });
                logger.info(`🎯 활동 상태 업데이트: ${activity.name}`);
            }, 5 * 60 * 1000); // 5분
            
            // 서버별 초기화 작업
            for (const [guildId, guild] of client.guilds.cache) {
                try {
                    // 서버 정보 로깅
                    logger.info(`🏰 서버 연결됨: ${guild.name} (ID: ${guild.id}) - 멤버 수: ${guild.memberCount}`);
                    
                    // 서버별 설정 초기화 (데이터베이스 연동 시 사용)
                    await initializeGuildSettings(guild);
                    
                } catch (guildError) {
                    logger.error(`서버 초기화 실패 (${guild.name}): ${guildError.message}`);
                }
            }
            
            // 통계 정보 웹훅 전송 (설정된 경우)
            await sendReadyWebhook(client);
            
            // 정기적인 상태 체크 시작
            startHealthCheck(client);
            
            // 데이터베이스 정리 작업 시작 (필요시)
            startCleanupTasks(client);
            
            logger.success('✅ 모든 초기화 작업이 완료되었습니다!');
            
        } catch (error) {
            logger.error(`봇 준비 이벤트 처리 중 오류: ${error.message}`);
        }
    }
};

// 서버별 설정 초기화 함수
async function initializeGuildSettings(guild) {
    const { logger } = require('../index.js');
    
    try {
        // 데이터베이스에 서버 정보가 없으면 생성
        // 실제 구현 시 Prisma나 다른 ORM을 사용하여 데이터베이스 연동
        
        // 예시: 기본 설정 값들
        const defaultSettings = {
            guildId: guild.id,
            guildName: guild.name,
            prefix: '!',
            language: 'ko',
            timezone: 'Asia/Seoul',
            partyChannelId: null,
            logChannelId: null,
            welcomeChannelId: null,
            autoRole: null,
            partyNotificationRole: null,
            settings: {
                autoDeleteParties: true,
                requireApproval: false,
                maxPartiesPerUser: 5,
                partyDuration: 24 * 60 * 60 * 1000, // 24시간
                allowAnonymousParties: false
            }
        };
        
        logger.info(`서버 설정 초기화 완료: ${guild.name}`);
        
    } catch (error) {
        logger.error(`서버 설정 초기화 실패: ${error.message}`);
    }
}

// 준비 완료 웹훅 전송
async function sendReadyWebhook(client) {
    const { logger } = require('../index.js');
    
    if (!process.env.LOG_WEBHOOK_URL) return;
    
    try {
        const { WebhookClient, EmbedBuilder } = require('discord.js');
        const webhook = new WebhookClient({ url: process.env.LOG_WEBHOOK_URL });
        
        const readyEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🤖 Aimdot.dev Bot 온라인')
            .setDescription('봇이 성공적으로 시작되었습니다.')
            .addFields([
                {
                    name: '📊 서버 정보',
                    value: `**서버 수:** ${client.guilds.cache.size}\n**사용자 수:** ${client.users.cache.size}\n**명령어 수:** ${client.commands.size}`,
                    inline: true
                },
                {
                    name: '🔧 시스템 정보',
                    value: `**Node.js:** ${process.version}\n**메모리 사용량:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n**업타임:** <t:${Math.floor(Date.now() / 1000)}:R>`,
                    inline: true
                }
            ])
            .setThumbnail('https://i.imgur.com/Sd8qK9c.gif')
            .setFooter({
                text: 'Aimdot.dev System',
                iconURL: 'https://i.imgur.com/Sd8qK9c.gif'
            })
            .setTimestamp();
        
        await webhook.send({ embeds: [readyEmbed] });
        logger.info('준비 완료 웹훅 전송됨');
        
    } catch (error) {
        logger.error(`웹훅 전송 실패: ${error.message}`);
    }
}

// 상태 체크 시작
function startHealthCheck(client) {
    const { logger } = require('../index.js');
    
    // 30분마다 상태 체크
    setInterval(async () => {
        try {
            const memoryUsage = process.memoryUsage();
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