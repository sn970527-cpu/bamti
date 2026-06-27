import React, { useState, useEffect } from 'react';
import PortalHome from './components/PortalHome';
import AdminPanel from './components/AdminPanel';
import Modal from './components/Modal';
import EthicsGate from './components/EthicsGate';

// 처음에 접속했을 때 포털을 가득 채워줄 예시 학습용 웹앱 데이터
const SEED_APPS = [
  {
    id: 'seed-vocab',
    name: '🔤 영단어 스피드 퀴즈',
    description: '초등 필수 영단어를 플래시 카드와 흥미진진한 스피드 퀴즈로 외워보는 단어장 앱입니다.',
    category: ['언어', '퀴즈', '암기'],
    url: 'https://wordrow.kr/%EB%8B%A8%EC%96%B4-%EA%B2%8C%EC%9E%84/',
    thumbnail: '',
    updatedAt: '2026-06-27'
  },
  {
    id: 'seed-math',
    name: '🔢 구구단 레이싱 게임',
    description: '시간 내에 구구단 정답을 맞춰 결승선까지 달리는 흥미진진한 연산 연습 게임입니다.',
    category: ['수학', '퀴즈'],
    url: 'https://www.multiplication.com/games/play/grand-prix-multiplication',
    thumbnail: '',
    updatedAt: '2026-06-27'
  },
  {
    id: 'seed-coding',
    name: '💻 엔트리(Entry) 블록 코딩',
    description: '직관적인 블록 코딩을 통해 컴퓨터 사고력을 기르고 나만의 게임과 작품을 창작하는 사이트입니다.',
    url: 'https://playentry.org',
    category: ['코딩'],
    thumbnail: '',
    updatedAt: '2026-06-27'
  },
  {
    id: 'seed-science',
    name: '🧪 NASA 우주 탐험대',
    description: '우리 우주와 태양계 행성들에 관한 신비로운 정보들을 가상 탐험 형태로 보여주는 어린이용 과학 채널입니다.',
    url: 'https://spaceplace.nasa.gov/',
    category: ['과학'],
    thumbnail: '',
    updatedAt: '2026-06-27'
  }
];

export default function App() {
  const [apps, setApps] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);
  const [hasAgreedEthics, setHasAgreedEthics] = useState(false);
  
  // 팝업 모달 관리를 위한 상태 ('terms' | 'privacy' | null)
  const [activeModal, setActiveModal] = useState(null);

  // 1. 컴포넌트 마운트 시 localStorage에서 앱 데이터 및 테마 세팅
  useEffect(() => {
    // 윤리 가이드 동의 여부 로드
    const agreed = localStorage.getItem('learning_portal_ethics_agreed') === 'true';
    setHasAgreedEthics(agreed);
    // 앱 데이터 로드
    const storedApps = localStorage.getItem('learning_portal_apps');
    if (storedApps) {
      setApps(JSON.parse(storedApps));
    } else {
      // 저장된 데이터가 전혀 없으면 기본 시드 데이터 주입!
      localStorage.setItem('learning_portal_apps', JSON.stringify(SEED_APPS));
      setApps(SEED_APPS);
    }

    // 테마 정보 로드
    const storedTheme = localStorage.getItem('learning_portal_theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  // 2. 테마 토글 함수
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('learning_portal_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    addToast(nextTheme === 'light' ? '밝은 화면 모드로 전환되었습니다. ☀️' : '어두운 화면 모드로 전환되었습니다. 🌙', 'success');
  };

  // 3. 토스트 알림 추가 및 자동 제거
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // 3초 뒤에 자동 제거
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // 4. 앱 데이터 저장 (등록 & 수정 공용)
  const saveApp = (appData) => {
    setApps((prevApps) => {
      let updatedApps;
      const exists = prevApps.some((app) => app.id === appData.id);
      
      if (exists) {
        // 이미 존재하면 수정 (업데이트)
        updatedApps = prevApps.map((app) => (app.id === appData.id ? appData : app));
      } else {
        // 존재하지 않으면 신규 추가 (최상단에 배치하기 위해 앞에 결합)
        updatedApps = [appData, ...prevApps];
      }
      
      localStorage.setItem('learning_portal_apps', JSON.stringify(updatedApps));
      return updatedApps;
    });
  };

  // 5. 앱 데이터 삭제
  const deleteApp = (id) => {
    setApps((prevApps) => {
      const updatedApps = prevApps.filter((app) => app.id !== id);
      localStorage.setItem('learning_portal_apps', JSON.stringify(updatedApps));
      return updatedApps;
    });
  };

  // 6. 런처 실행 함수 (새 탭으로 열기)
  const executeApp = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!hasAgreedEthics) {
    return (
      <>
        <EthicsGate onAgree={() => {
          setHasAgreedEthics(true);
          localStorage.setItem('learning_portal_ethics_agreed', 'true');
          addToast('윤리 핵심 가이드를 지키기로 약속했습니다! 환영합니다! 🚀', 'success');
        }} />
        {/* 우측 하단 동적 토스트 알림창 */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div 
              key={toast.id} 
              className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
            >
              {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* 프리미엄 상단 헤더 */}
      <header className="glass-header">
        <div className="container header-content">
          <div className="logo-section" onClick={() => setCurrentView('home')}>
            <span className="logo-icon">🏫</span>
            <span>학습용 웹앱 포털</span>
          </div>

          <div className="nav-actions">
            {/* 홈으로 버튼 */}
            <button 
              className={`btn ${currentView === 'home' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('home')}
            >
              🏠 홈 포털
            </button>

            {/* 관리자 셋업 버튼 */}
            <button 
              className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('admin')}
            >
              🛠️ 관리 페이지
            </button>

            {/* 테마 변경 버튼 */}
            <button 
              className="btn-icon btn" 
              onClick={toggleTheme}
              title="화면 테마 변경"
              aria-label="화면 테마 변경"
              style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, padding: '24px 0' }}>
        {currentView === 'home' ? (
          <PortalHome 
            apps={apps} 
            onExecute={executeApp} 
          />
        ) : (
          <AdminPanel 
            apps={apps} 
            onSaveApp={saveApp} 
            onDeleteApp={deleteApp} 
            onAddToast={addToast}
            onResetEthics={() => {
              setHasAgreedEthics(false);
              addToast('윤리 가이드 동의 상태가 초기화되었습니다. 다시 서명이 필요합니다! 🔄', 'success');
            }}
          />
        )}
      </main>

      {/* 하단 푸터 (수정된 카피라이트 및 팝업용 링크 포함) */}
      <footer className="footer" style={{ padding: '32px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          
          {/* 이용약관 및 개인정보 처리방침 링크 (클릭 시 팝업 띄우기) */}
          <div style={{ display: 'flex', gap: '20px', fontWeight: 700, fontSize: '0.95rem' }}>
            <a 
              href="#terms" 
              onClick={(e) => { e.preventDefault(); setActiveModal('terms'); }}
              style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
            >
              이용약관
            </a>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <a 
              href="#privacy" 
              onClick={(e) => { e.preventDefault(); setActiveModal('privacy'); }}
              style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
            >
              개인정보처리방침
            </a>
          </div>

          {/* 학교 표준 요구사항 카피라이트 & 개인정보책임자 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            <div>
              <strong>© 2026 [학습용 웹앱 포털]. All rights reserved.</strong>
            </div>
            <div>
              개인정보책임자: <strong>조정연 교사</strong> (서울언북초등학교) | 문의: <strong>02-514-5981</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              ※ 본 서비스는 학생들의 소중한 개인정보를 서버에 수집하지 않으며, 추가한 데이터는 이용자의 웹 브라우저 로컬 저장소에만 보관됩니다.
            </div>
          </div>
        </div>
      </footer>

      {/* 이용약관 모달 (Popup) */}
      {activeModal === 'terms' && (
        <Modal title="이용약관" onClose={() => setActiveModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p>본 이용약관(이하 '약관')은 서울언북초등학교 조정연 교사(이하 '제공자')가 제공하는 교육용 웹 애플리케이션 포털 서비스(이하 '본 서비스')의 이용에 관한 사항을 규정합니다.</p>
            
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제1조 (목적)</h4>
            <p>이 약관은 제공자가 학교 교육 활동 지원을 위해 제공하는 무료 교육용 웹 애플리케이션 포털 서비스(이하 '서비스')를 이용함에 있어, 서비스 제공자와 이용자(학생 및 교사 등)의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제2조 (정의)</h4>
            <p>1. '서비스'란 본 플랫폼에서 제공하는 교육용 웹앱 모음 및 런처 기능을 말합니다.<br />
            2. '이용자'란 본 서비스에 접속하여 이 약관에 따라 제공자가 모아둔 학습용 앱을 탐색하고 실행하는 학생, 교사, 학부모 등 모든 사용자를 말합니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제3조 (약관의 명시와 개정)</h4>
            <p>1. 제공자는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면이나 링크를 통해 게시합니다.<br />
            2. 제공자는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제4조 (서비스의 제공)</h4>
            <p>1. 본 서비스는 교육 목적의 무료 웹 애플리케이션 포털 및 이동 링크를 제공합니다.<br />
            2. 서비스의 이용은 무료이며, 광고 노출이나 별도의 유료 결제가 전혀 필요하지 않습니다.<br />
            3. 본 서비스는 서울언북초등학교 학생들의 교육 활동 지원 및 자기주도적 학습을 목적으로 하며, 일체의 상업적 목적으로 운영되지 않습니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제5조 (서비스의 중단)</h4>
            <p>1. 제공자는 시스템 점검, 기기 교체 및 고장, 통신 두절 또는 클라우드 플랫폼의 사유가 발생한 경우에는 서비스 제공을 일시적으로 중단할 수 있습니다.<br />
            2. 본 서비스는 무료로 제공되는 교육 지원용 서비스이므로, 서비스 일시 중단이나 지연으로 인한 별도의 보상은 제공되지 않습니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제6조 (이용자의 데이터 관리)</h4>
            <p>1. 본 서비스는 별도의 데이터베이스 서버 대신 이용자 웹 브라우저의 로컬 저장소(localStorage)에 데이터를 저장합니다.<br />
            2. 이용자가 관리자 코드를 통해 직접 등록하거나 수정·삭제하는 학습 앱 정보는 이용자 본인의 스마트 기기/컴퓨터 브라우저에만 저장되므로, 기기 변경이나 브라우저 초기화(캐시 삭제 등) 시 데이터가 사라질 수 있으며 이에 대한 복구 책임은 제공자에게 있지 않습니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제7조 (이용자의 의무)</h4>
            <p>1. 이용자는 본 서비스를 올바른 교육적 목적으로만 사용하여야 합니다.<br />
            2. 이용자는 타인에게 해를 끼치거나, 허위/유해한 외부 웹사이트 링크를 등록하여 악용해서는 안 됩니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제8조 (운영자 정보 및 연락처)</h4>
            <p>제공자(교사): 조정연<br />
            소속: 서울언북초등학교<br />
            학교 대표 번호: 02-514-5981</p>
          </div>
        </Modal>
      )}

      {/* 개인정보처리방침 모달 (Popup) */}
      {activeModal === 'privacy' && (
        <Modal title="개인정보처리방침" onClose={() => setActiveModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p>본 개인정보처리방침은 서울언북초등학교 조정연 교사가 직접 개발하여 교육 활동에 활용하는 <strong>학습용 웹앱 포털</strong>(이하 '본 서비스')이 학생 및 정보주체의 개인정보를 보호하고 관련 법령을 준수하도록 하기 위해 수립 및 공개하는 방침입니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제1조 (개인정보의 처리 목적)</h4>
            <p>본 서비스는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <p style={{ paddingLeft: '10px' }}>
              - <strong>포털 및 서비스 제공</strong>: 학습용 웹앱 목록 제공, 카테고리 분류별 앱 탐색 및 실행(웹 런처).<br />
              - <strong>관리자 기능 운영</strong>: 등록된 학습 앱 관리 및 신규 앱 정보(제목, 설명, 카테고리, 썸네일 등) 등록·수정·삭제.<br />
              ※ 본 서비스는 비회원제로 운영되며, 일반 학생 이용자의 회원가입 및 개인정보 수집을 하지 않습니다.
            </p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제2조 (개인정보의 처리 및 보유기간)</h4>
            <p>본 서비스는 이용자의 개인정보(웹 브라우저 로컬 저장소에 저장된 앱 등록 데이터 등)를 서비스가 운영되는 동안 또는 이용자가 브라우저 캐시 및 사이트 데이터를 삭제하기 전까지 보유하고 처리합니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제3조 (처리하는 개인정보 항목)</h4>
            <p>1. <strong>학생/일반 이용자</strong>: 수집하는 개인정보 없음 (사용자가 직접 추가한 앱 정보만 기기 로컬 저장).<br />
            2. <strong>관리자/교사</strong>: 관리자 페이지 접근을 위한 인증 코드 체크.<br />
            3. <strong>수집하지 않는 항목</strong>: 주민등록번호, 주소, 전화번호, 이메일 등 불필요한 민감 정보.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제4조 (개인정보의 파기 절차 및 방법)</h4>
            <p>이용자가 본 서비스 이용을 중단하고자 하거나 데이터를 파기하고자 하는 경우, 웹 브라우저 설정을 통해 브라우저 쿠키 및 캐시, 또는 로컬 저장소(localStorage) 데이터를 삭제함으로써 즉시 모든 데이터를 영구 파기할 수 있습니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제5조 (개인정보의 안전성 확보조치)</h4>
            <p>1. <strong>데이터 전송 보안</strong>: 전 구간 보안 통신(HTTPS)을 사용하여 안전한 통신 환경을 제공합니다.<br />
            2. <strong>로컬 격리</strong>: 등록된 모든 앱 정보 및 설정은 타인과 공유되지 않으며, 오직 해당 기기 브라우저의 독립된 로컬 저장소(localStorage) 내에 안전하게 보관됩니다.</p>

            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '8px' }}>제6조 (개인정보 보호책임자)</h4>
            <p>
              성명: <strong>조정연</strong> (개발자)<br />
              소속: <strong>서울언북초등학교</strong><br />
              직위: 교사<br />
              연락처: <strong>02-514-5981</strong> (학교 교무실 대표 번호)
            </p>
          </div>
        </Modal>
      )}

      {/* 우측 하단 동적 토스트 알림창 */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
          >
            {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
