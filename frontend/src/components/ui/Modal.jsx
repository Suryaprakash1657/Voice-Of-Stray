import React, { useEffect, useRef, useState } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  closeOnOutsideClick = true,
  closeOnEsc = true
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setAnimationClass('open');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationClass('');
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!shouldRender) return null;

  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className={`modal-backdrop ${animationClass}`}
      onClick={handleOutsideClick}
    >
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .modal-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }
        .modal-dialog {
          background-color: var(--bg-card);
          width: 90%;
          max-width: 550px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          transform: scale(0.9) translateY(20px);
          opacity: 0;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .modal-backdrop.open .modal-dialog {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }
        .modal-close-btn {
          color: var(--text-muted);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }
        .modal-close-btn:hover {
          background-color: var(--bg-main);
          color: var(--text-main);
        }
        .modal-body {
          padding: 20px;
          overflow-y: auto;
          font-size: 1rem;
          line-height: 1.5;
        }
        .modal-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background-color: var(--bg-main);
        }
      `}</style>
      <div 
        className="modal-dialog" 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="ph ph-x"></i>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
