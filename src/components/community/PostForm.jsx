import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../features/community/communitySlice';

function PostForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost(formData));
    setFormData({ title: '', content: '' }); // ניקוי הטופס
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>יצירת פוסט חדש</h3>
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="כותרת"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          name="content"
          placeholder="תוכן"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">פרסם</button>
    </form>
  );
}

export default PostForm;
