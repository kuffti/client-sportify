import { useDispatch, useSelector } from 'react-redux';
import { likePost, adminDeletePost, adminEditPost } from '../../features/community/communitySlice';
import { useState } from 'react';

function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [editData, setEditData] = useState({
    title: post?.title || '',
    content: post?.content || ''
  });

  // בדיקת נתונים חסרים
  if (!post) return null;

  // מבנה נתונים בטוח
  const author = post.author || {};
  const authorName = author.name || 'משתמש לא ידוע';

  const handleLike = async () => {
    if (isLiking) return; // מונע לחיצות מרובות
    
    setIsLiking(true);
    await dispatch(likePost(post._id));
    
    // מחזיר את האפשרות ללחוץ שוב אחרי חצי שנייה
    setTimeout(() => {
      setIsLiking(false);
    }, 500);
  };

  const handleAdminDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) {
      await dispatch(adminDeletePost(post._id));
    }
  };

  const handleAdminEdit = async () => {
    await dispatch(adminEditPost({ postId: post._id, postData: editData }));
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-card">
      {user?.isAdmin && (
        <div className="admin-actions">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                ✏️ ערוך
              </button>
              <button onClick={handleAdminDelete} className="btn-delete">
                🗑️ מחק
              </button>
            </>
          ) : (
            <div className="edit-form">
              <input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="edit-input"
              />
              <textarea
                value={editData.content}
                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                className="edit-input"
              />
              <div className="edit-actions">
                <button onClick={handleAdminEdit} className="btn-save">
                  שמור
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-cancel">
                  ביטול
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-meta">
        <span>נכתב על ידי: {authorName}</span>
        <span className="post-date">{formatDate(post.createdAt)}</span>
        <button 
          onClick={handleLike} 
          className={`like-button ${post.likes?.includes(user?._id) ? 'liked' : ''}`}
          disabled={isLiking}
        >
          {post.likes?.includes(user?._id) ? '❤️' : '🤍'} 
          {post.likes?.length || 0}
        </button>
      </div>
      {post.comments?.length > 0 && (
        <div className="post-comments">
          {post.comments.map(comment => (
            <div key={comment._id} className="comment">
              <strong>{comment.user?.name || 'משתמש לא ידוע'}:</strong> {comment.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;
