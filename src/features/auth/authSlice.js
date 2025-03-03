import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';
import { showToast } from '../ui/uiSlice';

// מצב התחלתי
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null
};

// פעולה אסינכרונית להרשמה
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await api.post('/api/users/register', userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(showToast({
          message: 'ההרשמה הושלמה בהצלחה!',
          type: 'success'
        }));
        return response.data;
      }
    } catch (error) {
      // שיפור הטיפול בשגיאות
      const errorMessage = error.response?.data?.message || 'שגיאה בהרשמה';
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

// פעולה אסינכרונית להתחברות
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/login', userData);
      
      if (response.data) {
        // שמירת המשתמש ב-localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        
        dispatch(showToast({
          message: `ברוך הבא, ${response.data.name}!`,
          type: 'success'
        }));
        
        return response.data;
      }
    } catch (error) {
      // טיפול מפורט בשגיאות
      let errorMessage;
      
      if (error.response) {
        // השרת הגיב עם סטטוס שגיאה
        errorMessage = error.response.data?.message || 
                      'שגיאה בהתחברות, אנא בדוק את הפרטים שהזנת';
        
        // לוגים ספציפיים לדיבוג
        console.error('שגיאת תשובה:', {
          status: error.response.status,
          data: error.response.data,
          message: errorMessage
        });
      } else if (error.request) {
        // הבקשה נשלחה אך לא התקבלה תשובה
        errorMessage = 'בעיית תקשורת עם השרת, אנא נסה שוב מאוחר יותר';
        console.error('שגיאת בקשה (ללא תשובה):', error.request);
      } else {
        // שגיאה בהגדרת הבקשה
        errorMessage = 'שגיאה בהתחברות, אנא נסה שוב';
        console.error('שגיאת הגדרה:', error.message);
      }
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);

// פעולה אסינכרונית לעדכון פרופיל
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { dispatch, getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) {
        throw new Error('המשתמש לא מחובר');
      }
      
      const response = await api.put('/api/users/profile', profileData);
      
      if (response.data) {
        // עדכון נתוני המשתמש ב-localStorage
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        dispatch(showToast({
          message: 'הפרופיל עודכן בהצלחה!',
          type: 'success'
        }));
        
        return response.data;
      }
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה בעדכון הפרופיל',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון הפרופיל');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // חוזר על אותו תהליך עבור הרשמה
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // הוספת מקרים לעדכון פרופיל
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // עדכון נתוני המשתמש במצב
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
