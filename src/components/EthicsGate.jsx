import React, { useState } from 'react';

const GUIDELINES = [
  {
    id: 1,
    guideNum: '가이드 1',
    category: '활용 목적',
    values: [
      { text: '주도성', type: 'initiative' },
      { text: '합목적성', type: 'purpose' }
    ],
    title: "생성형 AI를 쓰기 전, '왜' 쓰는지 말할 수 있어야 해요.",
    description: "생성형 AI를 사용하기 전에 '지금 내가 왜 쓰려고 하지?'라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요. 모든 공부에 생성형 AI가 필요한 것은 아니므로, 지금 하는 활동에 생성형 AI를 사용하는 것이 나의 학습에 정말 도움이 될지 먼저 고민해요."
  },
  {
    id: 2,
    guideNum: '가이드 2',
    category: '주도적 학습',
    values: [
      { text: '주도성', type: 'initiative' }
    ],
    title: '생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.',
    description: '막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요. 주제에 대해 내가 아는 것과 내 아이디어를 먼저 공책에 적거나 정리한 뒤에 생성형 AI를 활용하세요.'
  },
  {
    id: 3,
    guideNum: '가이드 3',
    category: '비판적 검증',
    values: [
      { text: '주도성', type: 'initiative' }
    ],
    title: '생성형 AI가 틀릴 수 있다는 점을 알아요.',
    description: '생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 \'정말 맞을까?\' 하고 한 번 더 확인하는 습관을 가져요. 중요한 내용일수록 책을 찾아보거나 선생님께 여쭤보는 등 다른 방법으로도 꼭 다시 확인하세요.'
  },
  {
    id: 4,
    guideNum: '가이드 4',
    category: '사고의 확장',
    values: [
      { text: '주도성', type: 'initiative' },
      { text: '합목적성', type: 'purpose' }
    ],
    title: '생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.',
    description: '생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 생성형 AI의 결과물을 그대로 사용하지 않고, 나의 경험과 생각을 더하여 나만의 색깔을 담은 최종 결과물을 만들어요.'
  },
  {
    id: 5,
    guideNum: '가이드 5',
    category: '안전과 관계',
    values: [
      { text: '안전성', type: 'safety' }
    ],
    title: '나의 정보와 비밀을 말하지 않아요.',
    description: '내가 입력한 정보는 어디에서 어떻게 사용될지 모르기 때문에 이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안돼요. 생성형 AI는 계산된 답변을 내놓는 프로그램이라 감정이 없어요. 나의 고민을 털어놓으며 지나치게 의지하기보다, 친구나 부모님, 선생님과의 실제 대화를 통해 마음을 나누어요.'
  },
  {
    id: 6,
    guideNum: '가이드 6',
    category: '투명성·윤리',
    values: [
      { text: '투명성', type: 'transparency' }
    ],
    title: '생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.',
    description: '어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 나 자신을 속이지 않는 정직한 태도예요. 생성형 AI를 쓴 사실을 정직하게 밝힐 때 나의 노력이 더 빛나고 가치 있게 인정받을 수 있어요.'
  }
];

export default function EthicsGate({ onAgree }) {
  const [isChecked, setIsChecked] = useState(false);
  const [readCards, setReadCards] = useState({});

  const handleCardClick = (id) => {
    setReadCards(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleEnter = () => {
    if (isChecked) {
      onAgree();
    }
  };

  const allRead = Object.keys(readCards).length === GUIDELINES.length;

  return (
    <div className="gate-wrapper">
      <div className="gate-container animate-fade-in">
        
        {/* 헤더 타이틀 */}
        <header className="gate-header">
          <div className="gate-badge">🤖 에듀 테크 & 생성형 AI 윤리</div>
          <h1 className="gate-title">생성형 AI 윤리 핵심 가이드 6가지</h1>
          <p className="gate-subtitle">
            스마트하고 올바른 AI 활용을 위해 아래의 6가지 약속을 찬찬히 읽어보세요.<br />
            카드를 클릭해 하나씩 약속 도장을 쾅! 찍고 시작하기 버튼을 눌러보아요! 🤙
          </p>
        </header>

        {/* 6가지 가이드 카드 그리드 */}
        <div className="gate-grid">
          {GUIDELINES.map((item) => {
            const isRead = readCards[item.id];
            return (
              <div 
                key={item.id} 
                className={`gate-card ${isRead ? 'read' : ''}`}
                onClick={() => handleCardClick(item.id)}
              >
                <div className="gate-card-header">
                  <div className="gate-card-meta">
                    <span className="gate-guide-num">{item.guideNum}</span>
                    <span className="gate-category">{item.category}</span>
                  </div>
                  <div className="gate-value-badges">
                    {item.values.map((v, idx) => (
                      <span key={idx} className={`value-badge value-${v.type}`}>
                        {v.text}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h3 className="gate-card-title">{item.title}</h3>
                <p className="gate-card-desc">{item.description}</p>
                
                <div className="gate-card-footer">
                  {isRead ? (
                    <span className="stamp-read">🤝 약속 완료!</span>
                  ) : (
                    <span className="stamp-unread">클릭해서 약속하기 👉</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 동의 및 입장 동의 박스 */}
        <div className="gate-agreement-box">
          <div className="gate-progress-text">
            읽은 가이드: <strong>{Object.keys(readCards).length}</strong> / 6
          </div>
          
          <label className={`gate-checkbox-label ${!allRead ? 'disabled' : ''}`}>
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={!allRead}
              className="gate-checkbox"
            />
            <span className="checkbox-custom-text">
              {!allRead 
                ? "💡 6가지 가이드를 모두 클릭해서 약속을 완료해 주세요!"
                : "이 사진에 있는 윤리 핵심 가이드를 빠짐없이 읽었으며, 이를 지킬 것을 약속합니다! 🤙"
              }
            </span>
          </label>

          <button 
            className={`btn btn-primary btn-large gate-submit-btn ${isChecked ? 'ready animate-pulse' : ''}`}
            onClick={handleEnter}
            disabled={!isChecked}
          >
            🔓 약속하고 시작하기
          </button>
        </div>

      </div>
    </div>
  );
}
