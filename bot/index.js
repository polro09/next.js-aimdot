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

// 슬래시 명령어 등록 함수
async function registerSlashCommands() {
    try {
        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        logger.info('슬래시 명령어 등록 시작...');

        // 글로벌 명령어 등록
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );

        logger.success('슬래시 명령어가 성공적으로 등록되었습니다.');
    } catch (error) {
        logger.error(`슬래시 명령어 등록 실패: ${error.message}`);
    }
}

// 봇 상태 업데이트 함수
async function updateBotStatus() {
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
                version: '1.0.0'
            })
        });

        if (!response.ok) {
            logger.error(`봇 상태 업데이트 실패: ${response.status}`);
        }
    } catch (error) {
        logger.error(`봇 상태 업데이트 오류: ${error.message}`);
    }
}

// 봇 준비 이벤트
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
        
        // 봇 상태 업데이트 (주기적으로)
        await updateBotStatus();
        setInterval(updateBotStatus, 30000); // 30초마다 업데이트
        
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
                        inline: true
                    },
                    {
                        name: '⚙️ 설정',
                        value: '`/설정` 명령어로 서버 설정을 변경하세요.',
                        inline: true
                    },
                    {
                        name: '🔗 웹 대시보드',
                        value: '[Aimdot.dev](https://aimdot.dev)에서 더 많은 기능을 사용하세요!',
                        inline: false
                    }
                ],
                thumbnail: { url: 'https://i.imgur.com/Sd8qK9c.gif' },
                footer: {
                    text: 'Aimdot.dev | 문의: support@aimdot.dev',
                    icon_url: 'https://i.imgur.com/Sd8qK9c.gif'
                },
                timestamp: new Date().toISOString()
            };
            
            await guild.systemChannel.send({ embeds: [welcomeEmbed] });
        }
        
    } catch (error) {
        logger.error(`길드 조인 처리 오류: ${error.message}`);
    }
});

// 길드 나가기 이벤트
client.on('guildDelete', async (guild) => {
    logger.event(`서버 퇴장: ${guild.name} (ID: ${guild.id})`);
    
    // 데이터베이스에서 서버 정보 비활성화 (삭제하지 않음)
    try {
        await DatabaseUtils.deactivateGuild(guild.id);
        logger.database(`서버 비활성화 완료: ${guild.name}`);
    } catch (error) {
        logger.error(`서버 비활성화 오류: ${error.message}`);
    }
});

// 상호작용 생성 이벤트
client.on('interactionCreate', async (interaction) => {
    // 명령어 처리
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            logger.warn(`알 수 없는 명령어: ${interaction.commandName}`);
            return;
        }
        
        // 쿨다운 체크
        const { cooldowns } = client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
        
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    content: `⏱️ 잠시만요! \`${command.data.name}\` 명령어는 <t:${expiredTimestamp}:R>에 다시 사용할 수 있습니다.`,
                    ephemeral: true
                });
            }
        }
        
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        
        try {
            logger.command(`${interaction.user.tag}이(가) ${interaction.commandName} 명령어 실행`);
            await command.execute(interaction);
        } catch (error) {
            logger.error(`명령어 실행 오류: ${error.message}`);
            
            const errorReply = {
                content: '❌ 명령어 실행 중 오류가 발생했습니다.',
                ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorReply);
            } else {
                await interaction.reply(errorReply);
            }
        }
    }
    
    // 버튼 상호작용
    else if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
    }
    
    // 셀렉트 메뉴 상호작용
    else if (interaction.isStringSelectMenu()) {
        await handleSelectMenuInteraction(interaction);
    }
    
    // 모달 상호작용
    else if (interaction.isModalSubmit()) {
        await handleModalInteraction(interaction);
    }
    
    // 컨텍스트 메뉴 상호작용
    else if (interaction.isContextMenuCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            logger.warn(`알 수 없는 컨텍스트 메뉴: ${interaction.commandName}`);
            return;
        }
        
        try {
            logger.command(`${interaction.user.tag}이(가) ${interaction.commandName} 컨텍스트 메뉴 실행`);
            await command.execute(interaction);
        } catch (error) {
            logger.error(`컨텍스트 메뉴 실행 오류: ${error.message}`);
            
            const errorEmbed = {
                color: 0xff0000,
                title: '❌ 오류 발생',
                description: '명령 실행 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
            await interaction.reply({
                content: '⚠️ 이 버튼의 기능을 찾을 수 없습니다.',
                ephemeral: true
            });
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
            await interaction.reply({
                content: '⚠️ 이 메뉴의 기능을 찾을 수 없습니다.',
                ephemeral: true
            });
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
            await interaction.reply({
                content: '⚠️ 이 양식의 처리 기능을 찾을 수 없습니다.',
                ephemeral: true
            });
        }
    }
}

// 메시지 생성 이벤트
client.on('messageCreate', async (message) => {
    // 봇의 메시지는 무시
    if (message.author.bot) return;
    
    // DM 메시지 처리
    if (message.channel.type === 'DM') {
        logger.event(`DM 수신: ${message.author.tag} - ${message.content}`);
        
        // DM 로그 저장
        try {
            await DatabaseUtils.createLog({
                action: 'dm_received',
                userId: message.author.id,
                details: {
                    content: message.content,
                    attachments: message.attachments.map(a => a.url)
                }
            });
        } catch (error) {
            logger.error(`DM 로그 저장 실패: ${error.message}`);
        }
    }
});

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

// 처리되지 않은 프로미스 거부
process.on('unhandledRejection', (error) => {
    logger.error(`처리되지 않은 프로미스 거부: ${error}`);
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