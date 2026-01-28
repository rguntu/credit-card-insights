import { configureStore } from '@reduxjs/toolkit';
import insightsReducer from '../features/insightsSlice';
import cardsReducer from '../features/cardsSlice';

export const store = configureStore({
  reducer: {
    insights: insightsReducer,
    cards: cardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
