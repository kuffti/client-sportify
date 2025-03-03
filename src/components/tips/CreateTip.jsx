import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTip } from '../../features/tips/tipsSlice';

function CreateTip() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tipData, setTipData] = useState({
    title: '',
    content: '',
    category: 'nutrition'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipData.title || !tipData.content) return;
    
    await dispatch(createTip(tipData));
    setTipData({ title: '', content: '', category: 'nutrition' });
    setIsFormOpen(false);
  };

  return (
    <div className="create-tip-section">
      {!isFormOpen ? (
        <button 
          className="btn-create-tip" 
          onClick={() => setIsFormOpen(true)}
        >
          ➕ הוסף טיפ חדש
        </button>
      ) : (
        <div className="tip-form-container">
          <form onSubmit={handleSubmit} className="tip-form">
            <h3>טיפ חדש</h3>
            
            <div className="form-group">
              <label>כותרת</label>
              <input
                type="text"
                value={tipData.title}
                onChange={(e) => setTipData({ ...tipData, title: e.target.value })}
                placeholder="הזן כותרת לטיפ"
                required
              />
            </div>
            
            <div className="form-group">
              <label>קטגוריה</label>
              <select
                value={tipData.category}
                onChange={(e) => setTipData({ ...tipData, category: e.target.value })}
              >
                <option value="nutrition">תזונה</option>
                <option value="training">אימון</option>
                <option value="recovery">התאוששות</option>
                <option value="motivation">מוטיבציה</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>תוכן</label>
              <textarea
                value={tipData.content}
                onChange={(e) => setTipData({ ...tipData, content: e.target.value })}
                placeholder="הזן את תוכן הטיפ"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-submit">פרסם טיפ</button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setIsFormOpen(false)}
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateTip;
