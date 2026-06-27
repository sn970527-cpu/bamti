import React, { useEffect } from 'react';

export default function Modal({ title, children, onClose }) {
  // 모달이 열렸을 때 뒷배경의 스크롤을 막는 보너스 센스! 
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        // 모달창 바깥(어두운 배경)을 클릭했을 때만 닫히도록 설정
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="modal-body glass-card animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          width: '90%',
          maxWidth: '650px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
      >
        {/* 모달 헤더 */}
        <div 
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
            justifyContent: 'space-between'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{title}</h3>
          <button 
            onClick={onClose}
            className="btn-icon btn"
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 (스크롤 영역) */}
        <div 
          className="modal-text-content"
          style={{
            padding: '24px',
            overflowY: 'auto',
            fontSize: '0.92rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)',
            textAlign: 'left'
          }}
        >
          {children}
        </div>

        {/* 모달 푸터 */}
        <div 
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--bg-tertiary)'
          }}
        >
          <button className="btn btn-primary btn-small" onClick={onClose}>
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
