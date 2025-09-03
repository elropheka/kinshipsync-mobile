import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventVisibilityReducer from './slices/eventVisibilitySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  eventVisibility: eventVisibilityReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
