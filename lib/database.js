<<<<<<< HEAD
const mongoose = require('mongoose');

// MongoDB 연결 설정
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('💾 이미 MongoDB에 연결되어 있습니다.');
        return;
    }

    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // 연결 풀 최대 크기
            serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
            socketTimeoutMS: 45000, // 소켓 타임아웃
            bufferMaxEntries: 0, // 버퍼링 비활성화
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        isConnected = true;
        console.log('✅ MongoDB 연결 성공!');
    } catch (error) {
        console.error('❌ MongoDB 연결 실패:', error.message);
        throw error;
    }
};

// 연결 상태 모니터링
mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB 연결됨');
});

mongoose.connection.on('error', (err) => {
    console.error('💥 MongoDB 연결 에러:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📴 MongoDB 연결 해제됨');
    isConnected = false;
});

// 길드(서버) 스키마
const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildName: {
        type: String,
        required: true
    },
    guildIcon: String,
    ownerId: String,
    memberCount: {
        type: Number,
        default: 0
    },
    settings: {
        prefix: {
            type: String,
            default: '!'
        },
        language: {
            type: String,
            default: 'ko'
        },
        timezone: {
            type: String,
            default: 'Asia/Seoul'
        },
        partyChannelId: String,
        logChannelId: String,
        welcomeChannelId: String,
        autoRole: String,
        partyNotificationRole: String,
        autoDeleteParties: {
            type: Boolean,
            default: true
        },
        requireApproval: {
            type: Boolean,
            default: false
        },
        maxPartiesPerUser: {
            type: Number,
            default: 5
        },
        partyDuration: {
            type: Number,
            default: 24 * 60 * 60 * 1000 // 24시간
        },
        allowAnonymousParties: {
            type: Boolean,
            default: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'guilds'
});

// 사용자 스키마
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    discriminator: String,
    avatar: String,
    email: String,
    locale: {
        type: String,
        default: 'ko'
    },
    settings: {
        timezone: {
            type: String,
            default: 'Asia/Seoul'
        },
        notifications: {
            partyInvites: {
                type: Boolean,
                default: true
            },
            partyUpdates: {
                type: Boolean,
                default: true
            },
            partyReminders: {
                type: Boolean,
                default: true
            },
            systemUpdates: {
                type: Boolean,
                default: true
            }
        },
        privacy: {
            showProfile: {
                type: Boolean,
                default: true
            },
            showStats: {
                type: Boolean,
                default: true
            },
            allowDM: {
                type: Boolean,
                default: true
            }
        }
    },
    stats: {
        partiesCreated: {
            type: Number,
            default: 0
        },
        partiesJoined: {
            type: Number,
            default: 0
        },
        partiesCompleted: {
            type: Number,
            default: 0
        },
        hoursPlayed: {
            type: Number,
            default: 0
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'users'
});

// 게임 파티 스키마
const partySchema = new mongoose.Schema({
    partyId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    channelId: String,
    messageId: String,
    creatorId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 1000
    },
    game: {
        name: {
            type: String,
            required: true
        },
        type: String, // 'fps', 'mmorpg', 'moba', 'strategy', 'casual', etc.
        platform: String, // 'pc', 'mobile', 'console', 'cross-platform'
        imageUrl: String
    },
    schedule: {
        startTime: {
            type: Date,
            required: true
        },
        endTime: Date,
        timezone: {
            type: String,
            default: 'Asia/Seoul'
        },
        isRecurring: {
            type: Boolean,
            default: false
        },
        recurringPattern: String // 'daily', 'weekly', 'monthly'
    },
    participants: {
        max: {
            type: Number,
            required: true,
            min: 2,
            max: 50
        },
        current: [{
            userId: {
                type: String,
                required: true
            },
            username: String,
            joinedAt: {
                type: Date,
                default: Date.now
            },
            role: {
                type: String,
                enum: ['leader', 'member', 'substitute'],
                default: 'member'
            },
            status: {
                type: String,
                enum: ['confirmed', 'tentative', 'declined'],
                default: 'confirmed'
            }
        }],
        waitlist: [{
            userId: String,
            username: String,
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    requirements: {
        minLevel: Number,
        maxLevel: Number,
        requiredRoles: [String],
        experience: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'beginner'
        },
        voiceChat: {
            type: Boolean,
            default: false
        },
        ageRestriction: Number
    },
    status: {
        type: String,
        enum: ['open', 'full', 'started', 'completed', 'cancelled'],
        default: 'open',
        index: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'guild-only'],
        default: 'public'
    },
    tags: [String],
    notes: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    cancelledAt: Date
}, {
    timestamps: true,
    collection: 'parties'
});

// 스케줄 스키마
const scheduleSchema = new mongoose.Schema({
    scheduleId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    creatorId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    type: {
        type: String,
        enum: ['event', 'tournament', 'meeting', 'raid', 'training', 'other'],
        default: 'event'
    },
    dateTime: {
        type: Date,
        required: true,
        index: true
    },
    duration: Number, // 분 단위
    timezone: {
        type: String,
        default: 'Asia/Seoul'
    },
    participants: [{
        userId: String,
        username: String,
        status: {
            type: String,
            enum: ['attending', 'maybe', 'not-attending'],
            default: 'attending'
        }
    }],
    reminders: [{
        time: Number, // 분 단위 (예: 60 = 1시간 전)
        sent: {
            type: Boolean,
            default: false
        }
    }],
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
    },
    recurringEnd: Date,
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    channelId: String,
    messageId: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'schedules'
});

// 사용자 권한 스키마
const userPermissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    permissions: {
        manageParties: {
            type: Boolean,
            default: false
        },
        manageSchedules: {
            type: Boolean,
            default: false
        },
        manageUsers: {
            type: Boolean,
            default: false
        },
        viewLogs: {
            type: Boolean,
            default: false
        },
        manageSettings: {
            type: Boolean,
            default: false
        },
        sendAnnouncements: {
            type: Boolean,
            default: false
        }
    },
    roles: [String], // Discord 역할 ID 목록
    assignedBy: String,
    assignedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'userPermissions'
});

// 로그 스키마
const logSchema = new mongoose.Schema({
    logId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: String,
        index: true
    },
    userId: String,
    action: {
        type: String,
        required: true,
        index: true
    },
    details: mongoose.Schema.Types.Mixed,
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'debug'],
        default: 'info',
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    ip: String,
    userAgent: String
}, {
    timestamps: true,
    collection: 'logs'
});

// 인덱스 생성
guildSchema.index({ guildId: 1 });
guildSchema.index({ isActive: 1 });
guildSchema.index({ lastActivity: -1 });

userSchema.index({ userId: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.lastActive': -1 });

partySchema.index({ guildId: 1, status: 1 });
partySchema.index({ creatorId: 1, createdAt: -1 });
partySchema.index({ 'schedule.startTime': 1 });
partySchema.index({ status: 1, isActive: 1 });

scheduleSchema.index({ guildId: 1, dateTime: 1 });
scheduleSchema.index({ status: 1, isActive: 1 });

userPermissionSchema.index({ userId: 1, guildId: 1 }, { unique: true });

logSchema.index({ timestamp: -1 });
logSchema.index({ guildId: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });

// TTL 인덱스 (자동 삭제)
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30일 후 자동 삭제

// 모델 생성
const Guild = mongoose.model('Guild', guildSchema);
const User = mongoose.model('User', userSchema);
const Party = mongoose.model('Party', partySchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const UserPermission = mongoose.model('UserPermission', userPermissionSchema);
const Log = mongoose.model('Log', logSchema);

// 유틸리티 함수들
const DatabaseUtils = {
    // 길드 초기화
    async initializeGuild(guildData) {
        try {
            const existingGuild = await Guild.findOne({ guildId: guildData.guildId });
            if (existingGuild) {
                // 기존 길드 정보 업데이트
                existingGuild.guildName = guildData.guildName;
                existingGuild.guildIcon = guildData.guildIcon;
                existingGuild.memberCount = guildData.memberCount;
                existingGuild.lastActivity = new Date();
                existingGuild.isActive = true;
                return await existingGuild.save();
            } else {
                // 새 길드 생성
                const newGuild = new Guild(guildData);
                return await newGuild.save();
            }
        } catch (error) {
            console.error('길드 초기화 오류:', error);
            throw error;
        }
    },

    // 사용자 초기화
    async initializeUser(userData) {
        try {
            const existingUser = await User.findOne({ userId: userData.userId });
            if (existingUser) {
                // 기존 사용자 정보 업데이트
                existingUser.username = userData.username;
                existingUser.discriminator = userData.discriminator;
                existingUser.avatar = userData.avatar;
                existingUser.stats.lastActive = new Date();
                existingUser.isActive = true;
                return await existingUser.save();
            } else {
                // 새 사용자 생성
                const newUser = new User(userData);
                return await newUser.save();
            }
        } catch (error) {
            console.error('사용자 초기화 오류:', error);
            throw error;
        }
    },

    // 파티 생성
    async createParty(partyData) {
        try {
            const party = new Party(partyData);
            return await party.save();
        } catch (error) {
            console.error('파티 생성 오류:', error);
            throw error;
        }
    },

    // 활성 파티 조회
    async getActivePartiesByGuild(guildId) {
        try {
            return await Party.find({
                guildId,
                status: { $in: ['open', 'full', 'started'] },
                isActive: true
            }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('활성 파티 조회 오류:', error);
            throw error;
        }
    },

    // 로그 기록
    async createLog(logData) {
        try {
            const log = new Log({
                ...logData,
                logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
            return await log.save();
        } catch (error) {
            console.error('로그 생성 오류:', error);
            // 로그 생성 실패는 주요 기능에 영향을 주지 않도록 에러를 throw하지 않음
        }
    }
};

module.exports = {
    connectDB,
    Guild,
    User,
    Party,
    Schedule,
    UserPermission,
    Log,
    DatabaseUtils
=======
const mongoose = require('mongoose');

// MongoDB 연결 설정
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('💾 이미 MongoDB에 연결되어 있습니다.');
        return;
    }

    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // 연결 풀 최대 크기
            serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
            socketTimeoutMS: 45000, // 소켓 타임아웃
            bufferMaxEntries: 0, // 버퍼링 비활성화
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        isConnected = true;
        console.log('✅ MongoDB 연결 성공!');
    } catch (error) {
        console.error('❌ MongoDB 연결 실패:', error.message);
        throw error;
    }
};

// 연결 상태 모니터링
mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB 연결됨');
});

mongoose.connection.on('error', (err) => {
    console.error('💥 MongoDB 연결 에러:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📴 MongoDB 연결 해제됨');
    isConnected = false;
});

// 길드(서버) 스키마
const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildName: {
        type: String,
        required: true
    },
    guildIcon: String,
    ownerId: String,
    memberCount: {
        type: Number,
        default: 0
    },
    settings: {
        prefix: {
            type: String,
            default: '!'
        },
        language: {
            type: String,
            default: 'ko'
        },
        timezone: {
            type: String,
            default: 'Asia/Seoul'
        },
        partyChannelId: String,
        logChannelId: String,
        welcomeChannelId: String,
        autoRole: String,
        partyNotificationRole: String,
        autoDeleteParties: {
            type: Boolean,
            default: true
        },
        requireApproval: {
            type: Boolean,
            default: false
        },
        maxPartiesPerUser: {
            type: Number,
            default: 5
        },
        partyDuration: {
            type: Number,
            default: 24 * 60 * 60 * 1000 // 24시간
        },
        allowAnonymousParties: {
            type: Boolean,
            default: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'guilds'
});

// 사용자 스키마
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    discriminator: String,
    avatar: String,
    email: String,
    locale: {
        type: String,
        default: 'ko'
    },
    settings: {
        timezone: {
            type: String,
            default: 'Asia/Seoul'
        },
        notifications: {
            partyInvites: {
                type: Boolean,
                default: true
            },
            partyUpdates: {
                type: Boolean,
                default: true
            },
            partyReminders: {
                type: Boolean,
                default: true
            },
            systemUpdates: {
                type: Boolean,
                default: true
            }
        },
        privacy: {
            showProfile: {
                type: Boolean,
                default: true
            },
            showStats: {
                type: Boolean,
                default: true
            },
            allowDM: {
                type: Boolean,
                default: true
            }
        }
    },
    stats: {
        partiesCreated: {
            type: Number,
            default: 0
        },
        partiesJoined: {
            type: Number,
            default: 0
        },
        partiesCompleted: {
            type: Number,
            default: 0
        },
        hoursPlayed: {
            type: Number,
            default: 0
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'users'
});

// 게임 파티 스키마
const partySchema = new mongoose.Schema({
    partyId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    channelId: String,
    messageId: String,
    creatorId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 1000
    },
    game: {
        name: {
            type: String,
            required: true
        },
        type: String, // 'fps', 'mmorpg', 'moba', 'strategy', 'casual', etc.
        platform: String, // 'pc', 'mobile', 'console', 'cross-platform'
        imageUrl: String
    },
    schedule: {
        startTime: {
            type: Date,
            required: true
        },
        endTime: Date,
        timezone: {
            type: String,
            default: 'Asia/Seoul'
        },
        isRecurring: {
            type: Boolean,
            default: false
        },
        recurringPattern: String // 'daily', 'weekly', 'monthly'
    },
    participants: {
        max: {
            type: Number,
            required: true,
            min: 2,
            max: 50
        },
        current: [{
            userId: {
                type: String,
                required: true
            },
            username: String,
            joinedAt: {
                type: Date,
                default: Date.now
            },
            role: {
                type: String,
                enum: ['leader', 'member', 'substitute'],
                default: 'member'
            },
            status: {
                type: String,
                enum: ['confirmed', 'tentative', 'declined'],
                default: 'confirmed'
            }
        }],
        waitlist: [{
            userId: String,
            username: String,
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    requirements: {
        minLevel: Number,
        maxLevel: Number,
        requiredRoles: [String],
        experience: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'beginner'
        },
        voiceChat: {
            type: Boolean,
            default: false
        },
        ageRestriction: Number
    },
    status: {
        type: String,
        enum: ['open', 'full', 'started', 'completed', 'cancelled'],
        default: 'open',
        index: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'guild-only'],
        default: 'public'
    },
    tags: [String],
    notes: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    cancelledAt: Date
}, {
    timestamps: true,
    collection: 'parties'
});

// 스케줄 스키마
const scheduleSchema = new mongoose.Schema({
    scheduleId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    creatorId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    type: {
        type: String,
        enum: ['event', 'tournament', 'meeting', 'raid', 'training', 'other'],
        default: 'event'
    },
    dateTime: {
        type: Date,
        required: true,
        index: true
    },
    duration: Number, // 분 단위
    timezone: {
        type: String,
        default: 'Asia/Seoul'
    },
    participants: [{
        userId: String,
        username: String,
        status: {
            type: String,
            enum: ['attending', 'maybe', 'not-attending'],
            default: 'attending'
        }
    }],
    reminders: [{
        time: Number, // 분 단위 (예: 60 = 1시간 전)
        sent: {
            type: Boolean,
            default: false
        }
    }],
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
    },
    recurringEnd: Date,
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    channelId: String,
    messageId: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'schedules'
});

// 사용자 권한 스키마
const userPermissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    permissions: {
        manageParties: {
            type: Boolean,
            default: false
        },
        manageSchedules: {
            type: Boolean,
            default: false
        },
        manageUsers: {
            type: Boolean,
            default: false
        },
        viewLogs: {
            type: Boolean,
            default: false
        },
        manageSettings: {
            type: Boolean,
            default: false
        },
        sendAnnouncements: {
            type: Boolean,
            default: false
        }
    },
    roles: [String], // Discord 역할 ID 목록
    assignedBy: String,
    assignedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'userPermissions'
});

// 로그 스키마
const logSchema = new mongoose.Schema({
    logId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: String,
        index: true
    },
    userId: String,
    action: {
        type: String,
        required: true,
        index: true
    },
    details: mongoose.Schema.Types.Mixed,
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'debug'],
        default: 'info',
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    ip: String,
    userAgent: String
}, {
    timestamps: true,
    collection: 'logs'
});

// 인덱스 생성
guildSchema.index({ guildId: 1 });
guildSchema.index({ isActive: 1 });
guildSchema.index({ lastActivity: -1 });

userSchema.index({ userId: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.lastActive': -1 });

partySchema.index({ guildId: 1, status: 1 });
partySchema.index({ creatorId: 1, createdAt: -1 });
partySchema.index({ 'schedule.startTime': 1 });
partySchema.index({ status: 1, isActive: 1 });

scheduleSchema.index({ guildId: 1, dateTime: 1 });
scheduleSchema.index({ status: 1, isActive: 1 });

userPermissionSchema.index({ userId: 1, guildId: 1 }, { unique: true });

logSchema.index({ timestamp: -1 });
logSchema.index({ guildId: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });

// TTL 인덱스 (자동 삭제)
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30일 후 자동 삭제

// 모델 생성
const Guild = mongoose.model('Guild', guildSchema);
const User = mongoose.model('User', userSchema);
const Party = mongoose.model('Party', partySchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const UserPermission = mongoose.model('UserPermission', userPermissionSchema);
const Log = mongoose.model('Log', logSchema);

// 유틸리티 함수들
const DatabaseUtils = {
    // 길드 초기화
    async initializeGuild(guildData) {
        try {
            const existingGuild = await Guild.findOne({ guildId: guildData.guildId });
            if (existingGuild) {
                // 기존 길드 정보 업데이트
                existingGuild.guildName = guildData.guildName;
                existingGuild.guildIcon = guildData.guildIcon;
                existingGuild.memberCount = guildData.memberCount;
                existingGuild.lastActivity = new Date();
                existingGuild.isActive = true;
                return await existingGuild.save();
            } else {
                // 새 길드 생성
                const newGuild = new Guild(guildData);
                return await newGuild.save();
            }
        } catch (error) {
            console.error('길드 초기화 오류:', error);
            throw error;
        }
    },

    // 사용자 초기화
    async initializeUser(userData) {
        try {
            const existingUser = await User.findOne({ userId: userData.userId });
            if (existingUser) {
                // 기존 사용자 정보 업데이트
                existingUser.username = userData.username;
                existingUser.discriminator = userData.discriminator;
                existingUser.avatar = userData.avatar;
                existingUser.stats.lastActive = new Date();
                existingUser.isActive = true;
                return await existingUser.save();
            } else {
                // 새 사용자 생성
                const newUser = new User(userData);
                return await newUser.save();
            }
        } catch (error) {
            console.error('사용자 초기화 오류:', error);
            throw error;
        }
    },

    // 파티 생성
    async createParty(partyData) {
        try {
            const party = new Party(partyData);
            return await party.save();
        } catch (error) {
            console.error('파티 생성 오류:', error);
            throw error;
        }
    },

    // 활성 파티 조회
    async getActivePartiesByGuild(guildId) {
        try {
            return await Party.find({
                guildId,
                status: { $in: ['open', 'full', 'started'] },
                isActive: true
            }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('활성 파티 조회 오류:', error);
            throw error;
        }
    },

    // 로그 기록
    async createLog(logData) {
        try {
            const log = new Log({
                ...logData,
                logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
            return await log.save();
        } catch (error) {
            console.error('로그 생성 오류:', error);
            // 로그 생성 실패는 주요 기능에 영향을 주지 않도록 에러를 throw하지 않음
        }
    }
};

module.exports = {
    connectDB,
    Guild,
    User,
    Party,
    Schedule,
    UserPermission,
    Log,
    DatabaseUtils
>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
};