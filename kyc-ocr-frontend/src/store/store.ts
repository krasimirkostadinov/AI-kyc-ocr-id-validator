import { configureStore } from '@reduxjs/toolkit';
import ocrReducer from '../features/ocr/ocrSlice';

const store = configureStore({
  reducer: {
    ocr: ocrReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
