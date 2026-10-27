import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-container ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <div className="toast-icon">
        {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      <div className="toast-message">
        <p className="toast-title">{isSuccess ? 'Success' : 'Error'}</p>
        <p className="toast-body">{toast.message}</p>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
