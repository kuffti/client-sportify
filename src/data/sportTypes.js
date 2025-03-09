// מבנה נתונים לסוגי הספורט השונים במערכת
export const sportTypes = [
  { id: 'running', name: 'ריצה', icon: '🏃‍♂️', color: 'green' },
  { id: 'football', name: 'כדורגל', icon: '⚽', color: 'red' },
  { id: 'basketball', name: 'כדורסל', icon: '🏀', color: 'orange' },
  { id: 'tennis', name: 'טניס', icon: '🎾', color: 'yellow' },
  { id: 'cycling', name: 'רכיבה על אופניים', icon: '🚴‍♂️', color: 'violet' },
  { id: 'swimming', name: 'שחייה', icon: '🏊‍♂️', color: 'blue' },
  { id: 'volleyball', name: 'כדורעף', icon: '🏐', color: 'gold' },
  { id: 'hiking', name: 'הליכה/טיולים', icon: '🥾', color: 'green' },
  { id: 'yoga', name: 'יוגה', icon: '🧘‍♀️', color: 'pink' },
  { id: 'other', name: 'אחר', icon: '🏆', color: 'grey' }
];

// המרה מזהה ספורט לאובייקט
export const getSportTypeById = (id) => {
  return sportTypes.find(sport => sport.id === id) || { 
    id: 'unknown', 
    name: 'לא ידוע', 
    icon: '❓',
    color: 'grey'
  };
};

// המרה משם ספורט לאובייקט
export const getSportTypeByName = (name) => {
  return sportTypes.find(sport => sport.name === name) || { 
    id: 'unknown', 
    name: 'לא ידוע', 
    icon: '❓',
    color: 'grey'
  };
};
