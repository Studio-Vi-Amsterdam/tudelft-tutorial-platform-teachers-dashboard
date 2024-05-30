import { configureStore } from '@reduxjs/toolkit';
import editorSlice from './features/editorSlice';
import mediaSlice from './features/mediaSlice';

export const store = configureStore({
    reducer: {
        editor: editorSlice,
        media: mediaSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
