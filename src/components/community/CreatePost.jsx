import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../features/community/communitySlice';

function CreatePost() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    await dispatch(createPost(formData));
    setFormData({ title: '', content: '' });
  };

  return (
    <div className="create-post-card">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="כותרת הפוסט"
          className="post-input"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
        <textarea
          placeholder="מה בא לך לשתף?"
          className="post-input post-content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        />
        <div className="post-actions">
          <button type="submit" className="btn btn-primary">פרסם</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
