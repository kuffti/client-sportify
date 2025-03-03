import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTips } from '../features/tips/tipsSlice';
import TipCard from '../components/tips/TipCard';
import CreateTip from '../components/tips/CreateTip';
import '../styles/tips.css';

// נתוני ברירת מחדל במקרה שאין טיפים מהשרת
const defaultTips = [
  {
    _id: 'default-1',
    title: 'שתו מספיק מים',
    content: 'חשוב לשתות 8-10 כוסות מים ביום, במיוחד כאשר מתאמנים.',
    category: 'nutrition',
    author: { name: 'צוות Sportify' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'default-2',
    title: 'חימום נכון לפני אימון',
    content: 'הקדישו לפחות 10 דקות לחימום לפני כל אימון. חימום טוב מכין את השרירים והמפרקים.',
    category: 'training',
    author: { name: 'צוות Sportify' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'default-3',
    title: 'שינה איכותית',
    content: 'שינה של 7-9 שעות בלילה חיונית להתאוששות השרירים ולשיפור ביצועים.',
    category: 'recovery',
    author: { name: 'צוות Sportify' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'default-4',
    title: 'הציבו מטרות ריאליות',
    content: 'קבעו מטרות ספציפיות, מדידות וברות-השגה. פרקו מטרות גדולות לצעדים קטנים.',
    category: 'motivation',
    author: { name: 'צוות Sportify' },
    createdAt: new Date().toISOString()
  }
];

function TipsPage() {
  const dispatch = useDispatch();
  const { tips, isLoading, error } = useSelector(state => state.tips);
  const { user } = useSelector(state => state.auth);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayedTips, setDisplayedTips] = useState([]);

  useEffect(() => {
    dispatch(getTips());
  }, [dispatch]);

  useEffect(() => {
    // השתמש בטיפים מהשרת אם יש, אחרת השתמש בברירת מחדל
    if (tips && tips.length > 0) {
      setDisplayedTips(tips);
    } else if (!isLoading) {
      setDisplayedTips(defaultTips);
    }
  }, [tips, isLoading]);

  const categories = [
    { id: 'all', name: 'הכל' },
    { id: 'nutrition', name: 'תזונה' },
    { id: 'training', name: 'אימון' },
    { id: 'recovery', name: 'התאוששות' },
    { id: 'motivation', name: 'מוטיבציה' }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? displayedTips 
    : displayedTips.filter(tip => tip.category === selectedCategory);

  return (
    <div className="tips-page">
      <div className="tips-header">
        <h1>טיפים והמלצות</h1>
        <p>טיפים מקצועיים שיעזרו לך להתקדם בספורט ולשמור על אורח חיים בריא</p>
      </div>

      <div className="categories-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {user?.isAdmin && <CreateTip />}

      {isLoading && <div className="loading">טוען טיפים...</div>}
      
      {error && <div className="error-message">{error}</div>}
      
      {!isLoading && (
        <div className="tips-container">
          {filteredTips.length > 0 ? (
            filteredTips.map(tip => <TipCard key={tip._id} tip={tip} />)
          ) : (
            <p className="no-tips">אין טיפים בקטגוריה זו עדיין</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TipsPage;
