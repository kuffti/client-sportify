import { useState } from 'react';
import './Tabs.css';

export function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || (children[0]?.props.id || ''));
  
  // מיפוי על הילדים כדי לקבל את הכותרות והאייקונים
  const tabTitles = children.map(child => ({
    id: child.props.id,
    title: child.props.title,
    icon: child.props.icon
  }));

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabTitles.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span>{tab.title}</span>
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {children.find(child => child.props.id === activeTab)}
      </div>
    </div>
  );
}

export function Tab({ children, id, title, icon }) {
  return <div className="tab-pane">{children}</div>;
}
