import { configureStore } from '@reduxjs/toolkit';
import editorSlice from './features/editorSlice';

export const store = configureStore({
    reducer: {
        editor: editorSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
