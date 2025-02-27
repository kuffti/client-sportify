import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';
import { showToast } from '../ui/uiSlice';

const initialState = {
  posts: [],
  isLoading: false,
  error: null
};

// יצירת הפעולות האסינכרוניות
export const getPosts = createAsyncThunk(
  'community/getPosts', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/posts'); // שינוי הנתיב
      // רק לוג אחד בדיבאג
      if (process.env.NODE_ENV === 'development') {
        console.log('Posts loaded:', response.data.length);
      }
      
      // וידוא תקינות הנתונים
      return response.data.map(post => ({
        ...post,
        author: post.author || { name: 'משתמש לא ידוע' },
        likes: post.likes || [],
        comments: post.comments || []
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת פוסטים');
    }
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (postData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/posts', postData); // שינוי הנתיב
      dispatch(showToast({
        message: 'הפוסט פורסם בהצלחה!',
        type: 'success'
      }));
      console.log('Create Post Response:', response.data); // הוספת לוג
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: 'שגיאה בפרסום הפוסט',
        type: 'error'
      }));
      console.error('Create Post Error:', error); // הוספת לוג שגיאה
      return rejectWithValue(error.response?.data?.message || 'שגיאה ביצירת פוסט');
    }
  }
);

const likePostAction = createAsyncThunk(
  'community/likePost',
  async (postId, { dispatch }) => {
    const response = await api.put(`/api/posts/${postId}/like`); // שינוי הנתיב
    dispatch(showToast({
      message: 'הפוסט סומן בלייק!',
      type: 'success'
    }));
    return response.data;
  }
);

export const adminDeletePost = createAsyncThunk(
  'community/adminDeletePost',
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      console.log(`Attempting to delete post: ${postId}`);
      const response = await api.delete(`/api/posts/admin/${postId}`);
      
      dispatch(showToast({
        message: 'הפוסט נמחק בהצלחה!',
        type: 'success'
      }));
      
      return postId;
    } catch (error) {
      console.error('Delete post error:', error);
      
      dispatch(showToast({
        message: `שגיאה במחיקת הפוסט: ${error.response?.data?.message || error.message}`,
        type: 'error'
      }));
      
      return rejectWithValue(error.response?.data || { message: 'שגיאה במחיקת הפוסט' });
    }
  }
);

export const adminEditPost = createAsyncThunk(
  'community/adminEditPost',
  async ({ postId, postData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/api/posts/admin/${postId}`, postData); // שינוי הנתיב
      dispatch(showToast({
        message: 'הפוסט נערך בהצלחה!',
        type: 'success'
      }));
      return response.data;
    } catch (error) {
      dispatch(showToast({
        message: 'שגיאה בעריכת הפוסט',
        type: 'error'
      }));
      return rejectWithValue(error.response?.data);
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state) => {
        state.isLoading = false;
        state.error = 'שגיאה בטעינת הפוסטים';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(likePostAction.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(adminDeletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      .addCase(adminEditPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  }
});

// ייצוא מפורש של כל הפעולות
export const likePost = likePostAction;
export default communitySlice.reducer;
