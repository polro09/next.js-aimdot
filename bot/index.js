// bot/index.js - Aimdot.dev Discord Bot 메인 파일
const { Client, GatewayIntentBits, ActivityType, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 데이터베이스 연결
const { connectDB, DatabaseUtils } = require('../lib/database.js');

// 로거 설정
const logger = {
    info: (message) => console.log(`🤖 [BOT] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    error: (message) => console.log(`❌ [ERROR] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    warn: (message) => console.log(`⚠️ [WARN] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    success: (message) => console.log(`✅ [SUCCESS] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    command: (message) => console.log(`⚡ [COMMAND] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    event: (message) => console.log(`🎯 [EVENT] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    database: (message) => console.log(`💾 [DATABASE] ${new Date().toLocaleString('ko-KR')} - ${message}`),
    debug: (message) => console.log(`🔍 [DEBUG] ${new Date().toLocaleString('ko-KR')} - ${message}`)
};

// 클라이언트 인스턴스 생성
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages
    ]
});

// 명령어 컬렉션 초기화
client.commands = new Collection();
client.cooldowns = new Collection();

// 명령어 로더 함수
async function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    
    try {
        if (!fs.existsSync(commandsPath)) {
            fs.mkdirSync(commandsPath, { recursive: true });
            logger.warn('commands 폴더가 생성되었습니다.');
        }

        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            try {
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    logger.success(`명령어 로드됨: ${command.data.name}`);
                } else {
                    logger.warn(`${file} 파일에 필수 속성이 누락되었습니다.`);
                }
            } catch (error) {
                logger.error(`명령어 로드 실패 (${file}): ${error.message}`);
            }
        }
        
        logger.info(`총 ${client.commands.size}개의 명령어가 로드되었습니다.`);
    } catch (error) {
        logger.error(`명령어 로더 오류: ${error.message}`);
    }
}

// 이벤트 로더 함수
async function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    
    try {
        if (!fs.existsSync(eventsPath)) {
            fs.mkdirSync(eventsPath, { recursive: true });
            logger.warn('events 폴더가 생성되었습니다.');
        }

        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            try {
                const event = require(filePath);
                
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                
                logger.success(`이벤트 로드됨: ${event.name}`);
            } catch (error) {
                logger.error(`이벤트 로드 실패 (${file}): ${error.message}`);
            }
        }
    } catch (error) {
        logger.error(`이벤트 로더 오류: ${error.message}`);
    }
}

// 봇 준비 이벤트 (ready.js 파일로 이동됨)
client.once('ready', async () => {
    logger.success(`${client.user.tag}이(가) 온라인 상태입니다!`);
    logger.info(`${client.guilds.cache.size}개 서버에서 활동 중`);
    logger.info(`${client.users.cache.size}명의 사용자와 연결됨`);
    
    // 봇 상태 설정
    client.user.setActivity('Aimdot.dev | 게임 파티 관리', { 
        type: ActivityType.Playing 
    });
    
    try {
        // 데이터베이스 연결
        await connectDB();
        logger.database('MongoDB 연결 완료');
        
        // 서버별 초기화
        for (const [guildId, guild] of client.guilds.cache) {
            try {
                await DatabaseUtils.initializeGuild({
                    guildId: guild.id,
                    guildName: guild.name,
                    guildIcon: guild.iconURL(),
                    ownerId: guild.ownerId,
                    memberCount: guild.memberCount
                });
                logger.database(`서버 초기화 완료: ${guild.name}`);
            } catch (dbError) {
                logger.error(`서버 DB 초기화 실패 (${guild.name}): ${dbError.message}`);
            }
        }
        
        // 슬래시 명령어 등록
        await registerSlashCommands();
        
    } catch (error) {
        logger.error(`초기화 중 오류: ${error.message}`);
    }
});

// 길드 조인 이벤트
client.on('guildCreate', async (guild) => {
    try {
        logger.event(`새 서버 참가: ${guild.name} (ID: ${guild.id})`);
        
        await DatabaseUtils.initializeGuild({
            guildId: guild.id,
            guildName: guild.name,
            guildIcon: guild.iconURL(),
            ownerId: guild.ownerId,
            memberCount: guild.memberCount
        });
        
        logger.database(`새 서버 DB 초기화 완료: ${guild.name}`);
        
        // 환영 메시지 전송 (시스템 채널이 있는 경우)
        if (guild.systemChannel) {
            const welcomeEmbed = {
                color: 0x5865f2,
                title: '🎉 Aimdot.dev에 오신 것을 환영합니다!',
                description: '게임 파티 관리를 위한 Discord Bot입니다.',
                fields: [
                    {
                        name: '🚀 시작하기',
                        value: '`/도움말` 명령어로 사용법을 확인하세요!',
                        inline: false
                    },
                    {
                        name: '💡 주요 기능',
                        value: '• 게임 파티 생성 및 관리\n• 스케줄 설정\n• 참가자 관리\n• 알림 기능',
                        inline: false
                    },
                    {
                        name: '🌐 웹 대시보드',
                        value: '[aimdot.dev](https://aimdot.dev)에서 더 많은 기능을 사용하세요!',
                        inline: false
                    }
                ],
                thumbnail: { url: 'https://i.imgur.com/Sd8qK9c.gif' },
                footer: {
                    text: 'Aimdot.dev',
                    icon_url: 'https://i.imgur.com/Sd8qK9c.gif'
                },
                timestamp: new Date().toISOString()
            };
            
            await guild.systemChannel.send({ embeds: [welcomeEmbed] });
        }
        
        // 로그 기록
        await DatabaseUtils.createLog({
            guildId: guild.id,
            action: 'bot_joined',
            details: {
                guildName: guild.name,
                memberCount: guild.memberCount
            },
            level: 'info'
        });
        
    } catch (error) {
        logger.error(`길드 조인 처리 중 오류: ${error.message}`);
    }
});

// 길드 탈퇴 이벤트
client.on('guildDelete', async (guild) => {
    try {
        logger.event(`서버 탈퇴: ${guild.name} (ID: ${guild.id})`);
        
        // 데이터베이스에서 비활성화 (삭제하지 않고 비활성화만)
        await Guild.updateOne(
            { guildId: guild.id },
            { isActive: false, lastActivity: new Date() }
        );
        
        logger.database(`서버 비활성화 완료: ${guild.name}`);
        
        // 로그 기록
        await DatabaseUtils.createLog({
            guildId: guild.id,
            action: 'bot_left',
            details: {
                guildName: guild.name
            },
            level: 'info'
        });
        
    } catch (error) {
        logger.error(`길드 탈퇴 처리 중 오류: ${error.message}`);
    }
});

// 슬래시 명령어 등록 함수
async function registerSlashCommands() {
    const commands = [];
    
    // 명령어 데이터 수집
    client.commands.forEach(command => {
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    });
    
    if (commands.length > 0) {
        try {
            // 글로벌 명령어 등록
            await client.application.commands.set(commands);
            logger.success(`${commands.length}개의 슬래시 명령어가 등록되었습니다.`);
        } catch (error) {
            logger.error(`슬래시 명령어 등록 실패: ${error.message}`);
        }
    }
}

// 상호작용 이벤트 처리
client.on('interactionCreate', async interaction => {
    try {
        // 슬래시 명령어 처리
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            
            if (!command) {
                logger.warn(`알 수 없는 명령어: ${interaction.commandName}`);
                return;
            }
            
            // 사용자 초기화
            try {
                await DatabaseUtils.initializeUser({
                    userId: interaction.user.id,
                    username: interaction.user.username,
                    discriminator: interaction.user.discriminator,
                    avatar: interaction.user.avatarURL()
                });
            } catch (userError) {
                logger.warn(`사용자 초기화 실패: ${userError.message}`);
            }
            
            // 쿨다운 체크
            const cooldowns = client.cooldowns;
            
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;
            
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    await interaction.reply({
                        content: `⏰ 잠시 기다려주세요! \`${command.data.name}\` 명령어를 다시 사용하려면 ${timeLeft.toFixed(1)}초 더 기다려야 합니다.`,
                        ephemeral: true
                    });
                    return;
                }
            }
            
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            
            // 명령어 실행
            logger.command(`${interaction.user.tag}이(가) /${command.data.name} 명령어를 실행했습니다.`);
            
            // 명령어 로그 기록
            await DatabaseUtils.createLog({
                guildId: interaction.guildId,
                userId: interaction.user.id,
                action: 'command_executed',
                details: {
                    commandName: command.data.name,
                    username: interaction.user.tag,
                    channelId: interaction.channelId
                },
                level: 'info'
            });
            
            await command.execute(interaction);
        }
        
        // 버튼 상호작용 처리
        if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        }
        
        // 셀렉트 메뉴 상호작용 처리
        if (interaction.isStringSelectMenu()) {
            await handleSelectMenuInteraction(interaction);
        }
        
        // 모달 상호작용 처리
        if (interaction.isModalSubmit()) {
            await handleModalInteraction(interaction);
        }
        
    } catch (error) {
        logger.error(`상호작용 처리 오류: ${error.message}`);
        
        // 에러 로그 기록
        await DatabaseUtils.createLog({
            guildId: interaction.guildId,
            userId: interaction.user.id,
            action: 'interaction_error',
            details: {
                error: error.message,
                interactionType: interaction.type
            },
            level: 'error'
        });
        
        const errorEmbed = {
            color: 0xff0000,
            title: '❌ 오류 발생',
            description: '명령어 실행 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            thumbnail: { url: 'https://i.imgur.com/Sd8qK9c.gif' },
            footer: {
                text: 'Aimdot.dev',
                icon_url: 'https://i.imgur.com/Sd8qK9c.gif'
            },
            timestamp: new Date().toISOString()
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

// 버튼 상호작용 핸들러
async function handleButtonInteraction(interaction) {
    const [action, type, ...params] = interaction.customId.split('_');
    
    // persistent 버튼 처리
    if (action === 'persistent') {
        const handlerPath = path.join(__dirname, 'interactions', 'buttons', `${type}.js`);
        
        if (fs.existsSync(handlerPath)) {
            const handler = require(handlerPath);
            await handler.execute(interaction, params);
        } else {
            logger.warn(`버튼 핸들러를 찾을 수 없음: ${type}`);
        }
    }
}

// 셀렉트 메뉴 상호작용 핸들러
async function handleSelectMenuInteraction(interaction) {
    const [action, type, ...params] = interaction.customId.split('_');
    
    if (action === 'persistent') {
        const handlerPath = path.join(__dirname, 'interactions', 'selectmenus', `${type}.js`);
        
        if (fs.existsSync(handlerPath)) {
            const handler = require(handlerPath);
            await handler.execute(interaction, params);
        } else {
            logger.warn(`셀렉트 메뉴 핸들러를 찾을 수 없음: ${type}`);
        }
    }
}

// 모달 상호작용 핸들러
async function handleModalInteraction(interaction) {
    const [action, type, ...params] = interaction.customId.split('_');
    
    if (action === 'persistent') {
        const handlerPath = path.join(__dirname, 'interactions', 'modals', `${type}.js`);
        
        if (fs.existsSync(handlerPath)) {
            const handler = require(handlerPath);
            await handler.execute(interaction, params);
        } else {
            logger.warn(`모달 핸들러를 찾을 수 없음: ${type}`);
        }
    }
}

// 오류 이벤트 처리
client.on('error', error => {
    logger.error(`Discord.js 오류: ${error.message}`);
    
    // 심각한 오류 로그 기록
    DatabaseUtils.createLog({
        action: 'client_error',
        details: {
            error: error.message,
            stack: error.stack
        },
        level: 'error'
    });
});

client.on('warn', warning => {
    logger.warn(`Discord.js 경고: ${warning}`);
});

// 프로세스 종료 처리
process.on('SIGINT', () => {
    logger.info('봇을 종료합니다...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('봇을 종료합니다...');
    client.destroy();
    process.exit(0);
});

// 초기화 및 봇 시작
async function startBot() {
    try {
        logger.info('Aimdot.dev Discord Bot을 시작합니다...');
        
        // 필요한 폴더 생성
        const folders = ['commands', 'events', 'interactions/buttons', 'interactions/selectmenus', 'interactions/modals', 'utils'];
        folders.forEach(folder => {
            const folderPath = path.join(__dirname, folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                logger.info(`폴더 생성됨: ${folder}`);
            }
        });
        
        // 명령어 및 이벤트 로드
        await loadCommands();
        await loadEvents();
        
        // 디스코드 로그인
        await client.login(process.env.DISCORD_TOKEN);
        
    } catch (error) {
        logger.error(`봇 시작 실패: ${error.message}`);
        process.exit(1);
    }
}

// 봇 시작
startBot();

// 전역 클라이언트 내보내기
module.exports = { client, logger, DatabaseUtils };