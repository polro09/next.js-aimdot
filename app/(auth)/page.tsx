// app/page.tsx - 간단한 홈페이지 (UI 라이브러리 의존성 없음)
export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* 헤더 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem' 
      }}>
        <img 
          src="https://imgur.com/IOPA7gL.png" 
          alt="Aimdot.dev Logo"
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '16px',
            marginBottom: '1rem'
          }}
        />
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          margin: '0 0 1rem 0',
          color: '#1e293b'
        }}>
          Aimdot.dev
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#64748b',
          margin: 0
        }}>
          Discord Bot 관리 시스템
        </p>
      </div>

      {/* 기능 카드들 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        width: '100%',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            🎮 파티 관리
          </h3>
          <p style={{ 
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            게임 파티를 쉽게 생성하고 관리할 수 있습니다. 멤버 모집부터 게임 시작까지 모든 과정을 지원합니다.
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            📅 스케줄 관리
          </h3>
          <p style={{ 
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            게임 일정을 체계적으로 관리하고, 팀원들과 일정을 공유하여 효율적인 게임 환경을 만들어보세요.
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            🛡️ 권한 관리
          </h3>
          <p style={{ 
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            사용자별 권한을 세밀하게 설정하고, 서버 관리를 체계적으로 할 수 있는 도구를 제공합니다.
          </p>
        </div>
      </div>

      {/* CTA 버튼 */}
      <div style={{ textAlign: 'center' }}>
        <a 
          href="/auth/signin"
          style={{
            display: 'inline-block',
            backgroundColor: '#5865f2',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#4752c4'
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#5865f2'
          }}
        >
          Discord로 시작하기 →
        </a>
      </div>

      {/* 상태 정보 */}
      <div style={{ 
        marginTop: '3rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ 
          margin: 0,
          fontSize: '0.875rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          🟢 시스템 정상 운영 중 | 마지막 업데이트: {new Date().toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  )
}