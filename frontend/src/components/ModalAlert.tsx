import React from 'react';

interface ModalAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'confirm' | 'alert' | 'success' | 'error';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmText = 'Tamam',
  cancelText = 'İptal'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'confirm':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success':
        return 'btn-success';
      case 'error':
        return 'btn-danger';
      case 'confirm':
        return 'btn-primary';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {getIcon()}
        </div>
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{title}</h3>
        <p style={{ marginBottom: '2rem', color: '#7f8c8d', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {type === 'confirm' && (
            <button 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button 
            className={`btn ${getButtonClass()}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert; 