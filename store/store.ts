import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Recommended to turn off serializableCheck if using non-serializable values in state
      // or actions, though it's best practice to keep state serializable.
      // serializableCheck: false,
    }),
});

// Export AppDispatch and RootState from here as well, or ensure types/redux.ts is correctly set up
// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
