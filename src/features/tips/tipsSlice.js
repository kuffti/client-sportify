import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';
import { showToast } from '../ui/uiSlice';

const initialState = {
  tips: [],
  isLoading: false,
  error: null
};

// קבלת כל הטיפים
export const getTips = createAsyncThunk(
  'tips/getTips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/tips');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת הטיפים');
    }
  }
);

// יצירת טיפ חדש (אדמין בלבד)
export const createTip = createAsyncThunk(
  'tips/createTip',
  async (tipData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/tips', tipData);
      
      dispatch(showToast({
        message: 'הטיפ נוצר בהצלחה!',
        type: 'success'
      }));
      
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה ביצירת הטיפ',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה ביצירת הטיפ');
    }
  }
);

// עדכון טיפ (אדמין בלבד)
export const editTip = createAsyncThunk(
  'tips/editTip',
  async ({ tipId, tipData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/api/tips/${tipId}`, tipData);
      
      dispatch(showToast({
        message: 'הטיפ עודכן בהצלחה!',
        type: 'success'
      }));
      
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה בעדכון הטיפ',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון הטיפ');
    }
  }
);

// מחיקת טיפ (אדמין בלבד)
export const deleteTip = createAsyncThunk(
  'tips/deleteTip',
  async (tipId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/tips/${tipId}`);
      
      dispatch(showToast({
        message: 'הטיפ נמחק בהצלחה!',
        type: 'success'
      }));
      
      return tipId;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה במחיקת הטיפ',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה במחיקת הטיפ');
    }
  }
);

const tipsSlice = createSlice({
  name: 'tips',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getTips
      .addCase(getTips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tips = action.payload;
      })
      .addCase(getTips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createTip
      .addCase(createTip.fulfilled, (state, action) => {
        state.tips.unshift(action.payload);
      })
      // editTip
      .addCase(editTip.fulfilled, (state, action) => {
        const index = state.tips.findIndex(tip => tip._id === action.payload._id);
        if (index !== -1) {
          state.tips[index] = action.payload;
        }
      })
      // deleteTip
      .addCase(deleteTip.fulfilled, (state, action) => {
        state.tips = state.tips.filter(tip => tip._id !== action.payload);
      });
  }
});

export default tipsSlice.reducer;
