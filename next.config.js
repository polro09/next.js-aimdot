<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 실험적 기능 설정
  experimental: {
    // 서버 컴포넌트에서 외부 패키지 사용 허용
    serverComponentsExternalPackages: ['discord.js'],
  },

  // 이미지 도메인 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
    // 이미지 최적화 설정
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // 환경 변수 설정
  env: {
    DISCORD_BOT_INVITE_URL: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
  },

  // 리다이렉션 설정
  async redirects() {
    return [
      {
        source: '/invite',
        destination: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
        permanent: false,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/your-server-invite',
        permanent: false,
      },
      {
        source: '/support',
        destination: '/docs/support',
        permanent: true,
      },
    ]
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://aimdot.dev',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // 타입스크립트 설정
  typescript: {
    // 타입 에러가 있어도 빌드 진행 (운영 환경에서는 false로 설정 권장)
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 무시 (CI/CD에서 별도로 실행하는 경우)
    ignoreDuringBuilds: false,
  },

  // SWC 설정
  swcMinify: true,

  // 압축 설정
  compress: true,

  // 정적 페이지 생성 설정
  output: 'standalone',

  // 빌드 설정
  generateBuildId: async () => {
    // 커스텀 빌드 ID (배포 시 버전 관리용)
    return `${Date.now()}`
  },

  // 웹팩 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Discord.js 경고 해결
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })

    // 폴리필 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    // 개발 환경에서만 소스맵 생성
    if (dev) {
      config.devtool = 'eval-source-map'
    }

    return config
  },

  // 로깅 설정
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // 파워드 바이 헤더 제거
  poweredByHeader: false,

  // React strict mode 활성화
  reactStrictMode: true,

  // 트레일링 슬래시 제거
  trailingSlash: false,

  // 개발 환경 설정
  ...(process.env.NODE_ENV === 'development' && {
    // 개발 환경에서만 적용되는 설정
    onDemandEntries: {
      // 페이지가 메모리에 유지되는 시간 (ms)
      maxInactiveAge: 25 * 1000,
      // 동시에 메모리에 유지할 페이지 수
      pagesBufferLength: 2,
    },
  }),

  // 번들 분석기 (필요시 주석 해제)
  // ...(process.env.ANALYZE === 'true' && {
  //   webpack: (config) => {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'server',
  //         analyzerPort: 8888,
  //         openAnalyzer: true,
  //       })
  //     )
  //     return config
  //   },
  // }),
}

=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 실험적 기능 설정
  experimental: {
    // 서버 컴포넌트에서 외부 패키지 사용 허용
    serverComponentsExternalPackages: ['discord.js'],
  },

  // 이미지 도메인 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
    // 이미지 최적화 설정
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // 환경 변수 설정
  env: {
    DISCORD_BOT_INVITE_URL: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
  },

  // 리다이렉션 설정
  async redirects() {
    return [
      {
        source: '/invite',
        destination: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
        permanent: false,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/your-server-invite',
        permanent: false,
      },
      {
        source: '/support',
        destination: '/docs/support',
        permanent: true,
      },
    ]
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://aimdot.dev',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // 타입스크립트 설정
  typescript: {
    // 타입 에러가 있어도 빌드 진행 (운영 환경에서는 false로 설정 권장)
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 무시 (CI/CD에서 별도로 실행하는 경우)
    ignoreDuringBuilds: false,
  },

  // SWC 설정
  swcMinify: true,

  // 압축 설정
  compress: true,

  // 정적 페이지 생성 설정
  output: 'standalone',

  // 빌드 설정
  generateBuildId: async () => {
    // 커스텀 빌드 ID (배포 시 버전 관리용)
    return `${Date.now()}`
  },

  // 웹팩 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Discord.js 경고 해결
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })

    // 폴리필 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    // 개발 환경에서만 소스맵 생성
    if (dev) {
      config.devtool = 'eval-source-map'
    }

    return config
  },

  // 로깅 설정
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // 파워드 바이 헤더 제거
  poweredByHeader: false,

  // React strict mode 활성화
  reactStrictMode: true,

  // 트레일링 슬래시 제거
  trailingSlash: false,

  // 개발 환경 설정
  ...(process.env.NODE_ENV === 'development' && {
    // 개발 환경에서만 적용되는 설정
    onDemandEntries: {
      // 페이지가 메모리에 유지되는 시간 (ms)
      maxInactiveAge: 25 * 1000,
      // 동시에 메모리에 유지할 페이지 수
      pagesBufferLength: 2,
    },
  }),

  // 번들 분석기 (필요시 주석 해제)
  // ...(process.env.ANALYZE === 'true' && {
  //   webpack: (config) => {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'server',
  //         analyzerPort: 8888,
  //         openAnalyzer: true,
  //       })
  //     )
  //     return config
  //   },
  // }),
}

>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
module.exports = nextConfig