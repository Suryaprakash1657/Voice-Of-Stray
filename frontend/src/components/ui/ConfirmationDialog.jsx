import React from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function ConfirmationDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true
}) {
  const footer = (
    <>
      <Button 
        variant="secondary" 
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button 
        variant={isDanger ? 'danger' : 'primary'} 
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={footer}
      closeOnOutsideClick={false}
    >
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
        {message}
      </p>
    </Modal>
  );
}
