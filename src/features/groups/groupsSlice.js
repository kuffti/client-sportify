import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';
import { showToast } from '../ui/uiSlice';

const initialState = {
  groups: [],
  isLoading: false,
  error: null,
  currentGroup: null
};

// קבלת כל הקבוצות
export const getGroups = createAsyncThunk(
  'groups/getGroups',
  async (sportType = null, { rejectWithValue }) => {
    try {
      const url = sportType ? `/api/groups?sportType=${sportType}` : '/api/groups';
      const response = await api.get(url);
      
      // וידוא שהתשובה מכילה מערך
      const data = response.data || [];
      
      // וידוא שיש לכל קבוצה את השדות הנדרשים
      return data.map(group => ({
        ...group,
        participants: group.participants || [],
        creator: group.creator || null,
        location: group.location || null,
        maxParticipants: group.maxParticipants || 10
      }));
    } catch (error) {
      console.error('Error fetching groups:', error);
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת הקבוצות');
    }
  }
);

// יצירת קבוצה חדשה
export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/groups', groupData);
      
      dispatch(showToast({
        message: 'הקבוצה נוצרה בהצלחה!',
        type: 'success'
      }));
      
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה ביצירת הקבוצה',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה ביצירת הקבוצה');
    }
  }
);

// הצטרפות לקבוצה
export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async (groupId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/join`);
      
      dispatch(showToast({
        message: 'הצטרפת לקבוצה בהצלחה!',
        type: 'success'
      }));
      
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה בהצטרפות לקבוצה',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה בהצטרפות לקבוצה');
    }
  }
);

// עזיבת קבוצה
export const leaveGroup = createAsyncThunk(
  'groups/leaveGroup',
  async (groupId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/api/groups/${groupId}/leave`);
      
      dispatch(showToast({
        message: 'עזבת את הקבוצה בהצלחה',
        type: 'success'
      }));
      
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה בעזיבת הקבוצה',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה בעזיבת הקבוצה');
    }
  }
);

// מחיקת קבוצה
export const deleteGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/groups/${groupId}`);
      
      dispatch(showToast({
        message: 'הקבוצה נמחקה בהצלחה',
        type: 'success'
      }));
      
      return groupId;
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'שגיאה במחיקת הקבוצה',
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data?.message || 'שגיאה במחיקת הקבוצה');
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    resetCurrentGroup: (state) => {
      state.currentGroup = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // טיפול בקבלת קבוצות
      .addCase(getGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // טיפול ביצירת קבוצה
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
      })
      
      // טיפול בהצטרפות לקבוצה
      .addCase(joinGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex(group => group._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.currentGroup?._id === action.payload._id) {
          state.currentGroup = action.payload;
        }
      })
      
      // טיפול בעזיבת קבוצה
      .addCase(leaveGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex(group => group._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.currentGroup?._id === action.payload._id) {
          state.currentGroup = action.payload;
        }
      })
      
      // טיפול במחיקת קבוצה
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(group => group._id !== action.payload);
        if (state.currentGroup?._id === action.payload) {
          state.currentGroup = null;
        }
      });
  }
});

export const { setCurrentGroup, resetCurrentGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
