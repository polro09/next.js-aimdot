const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('핑')
        .setDescription('봇의 응답 시간을 확인합니다.'),
    
    cooldown: 5, // 5초 쿨다운
    
    async execute(interaction) {
        const { client, logger } = require('../index.js');
        
        try {
            // 명령어 실행 시작 시간
            const startTime = Date.now();
            
            // 먼저 응답을 지연시킵니다 (응답 시간 측정을 위해)
            await interaction.deferReply();
            
            // API 응답 시간 계산
            const apiLatency = Date.now() - startTime;
            
            // WebSocket 핑 (봇과 Discord 간의 연결 지연시간)
            const wsLatency = client.ws.ping;
            
            // 응답 품질 결정
            let qualityEmoji = '🟢';
            let qualityText = '매우 좋음';
            
            if (wsLatency > 200) {
                qualityEmoji = '🟡';
                qualityText = '보통';
            }
            if (wsLatency > 500) {
                qualityEmoji = '🟠';
                qualityText = '느림';
            }
            if (wsLatency > 1000) {
                qualityEmoji = '🔴';
                qualityText = '매우 느림';
            }
            
            // 임베드 생성
            const pingEmbed = new EmbedBuilder()
                .setColor(wsLatency < 200 ? 0x00ff00 : wsLatency < 500 ? 0xffff00 : 0xff0000)
                .setTitle('🏓 퐁!')
                .setDescription('봇의 응답 시간을 확인했습니다.')
                .addFields([
                    {
                        name: '📡 API 응답 시간',
                        value: `\`${apiLatency}ms\``,
                        inline: true
                    },
                    {
                        name: '🌐 WebSocket 핑',
                        value: `\`${wsLatency}ms\``,
                        inline: true
                    },
                    {
                        name: '📊 연결 품질',
                        value: `${qualityEmoji} ${qualityText}`,
                        inline: true
                    },
                    {
                        name: '🔄 봇 업타임',
                        value: `<t:${Math.floor((Date.now() - client.readyTimestamp) / 1000)}:R>`,
                        inline: false
                    },
                    {
                        name: '📈 서버 정보',
                        value: `**길드 수:** ${client.guilds.cache.size}\n**사용자 수:** ${client.users.cache.size}`,
                        inline: false
                    }
                ])
                .setThumbnail('https://i.imgur.com/Sd8qK9c.gif')
                .setFooter({
                    text: 'Aimdot.dev',
                    iconURL: 'https://i.imgur.com/Sd8qK9c.gif'
                })
                .setTimestamp();
            
            // 응답 전송
            await interaction.editReply({ embeds: [pingEmbed] });
            
            // 로그 기록
            logger.command(`핑 명령어 실행 완료 - API: ${apiLatency}ms, WS: ${wsLatency}ms`);
            
        } catch (error) {
            logger.error(`핑 명령어 실행 중 오류: ${error.message}`);
            
            // 에러 임베드
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ 오류 발생')
                .setDescription('핑 명령어 실행 중 오류가 발생했습니다.')
                .addFields([
                    {
                        name: '오류 내용',
                        value: `\`${error.message}\``,
                        inline: false
                    }
                ])
                .setThumbnail('https://i.imgur.com/Sd8qK9c.gif')
                .setFooter({
                    text: 'Aimdot.dev',
                    iconURL: 'https://i.imgur.com/Sd8qK9c.gif'
                })
                .setTimestamp();
            
            // 이미 응답을 지연시켰다면 editReply, 아니면 reply 사용
            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};