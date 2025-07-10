<<<<<<< HEAD
// app/(auth)/signin/page.tsx - 수정된 로그인 페이지
'use client'

export default function SignInPage() {
  const handleDiscordLogin = () => {
    alert('NextAuth 설정이 완료되면 Discord 로그인이 활성화됩니다.')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* 로고 */}
        <img 
          src="https://imgur.com/IOPA7gL.png" 
          alt="Aimdot.dev Logo"
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '16px',
            marginBottom: '2rem'
          }}
        />

        {/* 제목 */}
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#1e293b'
        }}>
          Aimdot.dev
        </h1>
        <p style={{ 
          color: '#64748b',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Discord Bot 관리 시스템
        </p>

        {/* 로그인 안내 */}
        <div style={{ 
          backgroundColor: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            🔐 관리자 로그인
          </h3>
          <p style={{ 
            color: '#64748b',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Discord 계정으로 로그인하여 봇 관리 시스템에 접속하세요
          </p>

          {/* Discord 로그인 버튼 */}
          <button
            style={{
              width: '100%',
              backgroundColor: '#5865f2',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#4752c4'
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#5865f2'
            }}
            onClick={handleDiscordLogin}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord로 로그인
          </button>
        </div>

        {/* 권한 안내 */}
        <div style={{ 
          fontSize: '0.75rem',
          color: '#94a3b8',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            로그인 시 다음 권한이 요청됩니다:
          </p>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            textAlign: 'left'
          }}>
            <div>👤 기본 프로필 정보 (닉네임, 아바타)</div>
            <div>🏰 서버 목록 (관리 권한 확인용)</div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← 홈페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
=======
// app/auth/signin/page.tsx - 간단한 로그인 페이지
export default function SignInPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* 로고 */}
        <img 
          src="https://imgur.com/IOPA7gL.png" 
          alt="Aimdot.dev Logo"
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '16px',
            marginBottom: '2rem'
          }}
        />

        {/* 제목 */}
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#1e293b'
        }}>
          Aimdot.dev
        </h1>
        <p style={{ 
          color: '#64748b',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Discord Bot 관리 시스템
        </p>

        {/* 로그인 안내 */}
        <div style={{ 
          backgroundColor: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            🔐 관리자 로그인
          </h3>
          <p style={{ 
            color: '#64748b',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Discord 계정으로 로그인하여 봇 관리 시스템에 접속하세요
          </p>

          {/* Discord 로그인 버튼 */}
          <button
            style={{
              width: '100%',
              backgroundColor: '#5865f2',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#4752c4'
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#5865f2'
            }}
            onClick={() => {
              alert('NextAuth 설정이 완료되면 Discord 로그인이 활성화됩니다.')
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord로 로그인
          </button>
        </div>

        {/* 권한 안내 */}
        <div style={{ 
          fontSize: '0.75rem',
          color: '#94a3b8',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            로그인 시 다음 권한이 요청됩니다:
          </p>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            textAlign: 'left'
          }}>
            <div>👤 기본 프로필 정보 (닉네임, 아바타)</div>
            <div>🏰 서버 목록 (관리 권한 확인용)</div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← 홈페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
}