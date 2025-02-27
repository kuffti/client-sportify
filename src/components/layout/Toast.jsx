import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../features/ui/uiSlice';
import './Toast.css';

function Toast() {
  const dispatch = useDispatch();
  const { show, message, type } = useSelector(state => state.ui.toast);

  useEffect(() => {
    let timer;
    if (show) {
      timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [show, dispatch]);

  if (!show) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon">✅</span>}
        {type === 'error' && <span className="toast-icon">❌</span>}
        {type === 'info' && <span className="toast-icon">ℹ️</span>}
        {type === 'warning' && <span className="toast-icon">⚠️</span>}
        <span className="toast-message">{message}</span>
      </div>
      <button 
        className="toast-close" 
        onClick={() => dispatch(hideToast())}
      >
        &times;
      </button>
    </div>
  );
}

export default Toast;
