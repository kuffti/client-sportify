import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../features/community/communitySlice';
import PostCard from './PostCard';

function PostList() {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector(state => state.community);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // השתמש ב-ref כדי לעקוב אחר פעולה חד-פעמית
    if (!hasLoadedRef.current) {
      console.log('Loading posts once...');
      dispatch(getPosts());
      hasLoadedRef.current = true;
    }
  }, [dispatch]);

  if (isLoading && !posts.length) return <div className="loading">טוען פוסטים...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!posts.length) return <div className="no-posts">אין פוסטים עדיין. היה הראשון לפרסם!</div>;

  return (
    <div className="posts-container">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
