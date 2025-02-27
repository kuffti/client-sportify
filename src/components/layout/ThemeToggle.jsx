import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/ui/themeSlice';

function ThemeToggle() {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector(state => state.theme);

  return (
    <button 
      className="theme-toggle"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDarkMode ? 'מצב יום' : 'מצב לילה'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
