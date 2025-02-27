import { useSelector } from 'react-redux';
import CreatePost from '../components/community/CreatePost';
import PostList from '../components/community/PostList';
import '../styles/community.css';

function CommunityPage() {
  const { error } = useSelector(state => state.community);
  function f(){
    console.log("f");
  }
  return (
    <div className="community-page">
      <div className="community-header">
        <h1>הקהילה שלנו</h1>
        <p>שתף חוויות, שאל שאלות והתחבר עם ספורטאים אחרים</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <CreatePost />
      <PostList />
    </div>
  );
}

export default CommunityPage;
