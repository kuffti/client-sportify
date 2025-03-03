import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTip, editTip } from '../../features/tips/tipsSlice';

function TipCard({ tip }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: tip.title,
    content: tip.content,
    category: tip.category
  });

  const categoryLabels = {
    nutrition: 'תזונה',
    training: 'אימון',
    recovery: 'התאוששות',
    motivation: 'מוטיבציה'
  };

  const handleDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק טיפ זה?')) {
      await dispatch(deleteTip(tip._id));
    }
  };

  const handleEdit = async () => {
    await dispatch(editTip({ 
      tipId: tip._id, 
      tipData: editData 
    }));
    setIsEditing(false);
  };

  return (
    <div className="tip-card">
      {user?.isAdmin && (
        <div className="admin-actions">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                ✏️ ערוך
              </button>
              <button onClick={handleDelete} className="btn-delete">
                🗑️ מחק
              </button>
            </>
          ) : (
            <div className="edit-form">
              <input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="edit-input"
                placeholder="כותרת"
              />
              
              <textarea
                value={editData.content}
                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                className="edit-input"
                placeholder="תוכן"
              />
              
              <select
                value={editData.category}
                onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                className="edit-input"
              >
                <option value="nutrition">תזונה</option>
                <option value="training">אימון</option>
                <option value="recovery">התאוששות</option>
                <option value="motivation">מוטיבציה</option>
              </select>
              
              <div className="edit-actions">
                <button onClick={handleEdit} className="btn-save">שמור</button>
                <button onClick={() => setIsEditing(false)} className="btn-cancel">ביטול</button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="tip-category">{categoryLabels[tip.category]}</div>
      <h3 className="tip-title">{tip.title}</h3>
      <p className="tip-content">{tip.content}</p>
      <div className="tip-footer">
        <div className="tip-author">פורסם ע"י: {tip.author?.name || 'צוות Sportify'}</div>
        <div className="tip-date">
          {new Date(tip.createdAt).toLocaleDateString('he-IL')}
        </div>
      </div>
    </div>
  );
}

export default TipCard;
