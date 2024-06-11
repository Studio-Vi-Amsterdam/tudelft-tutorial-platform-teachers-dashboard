import { configureStore } from '@reduxjs/toolkit';
import editorSlice from './features/editorSlice';
import mediaSlice from './features/mediaSlice';
import dashboardSlice from './features/dashboardSlice';

export const store = configureStore({
    reducer: {
        editor: editorSlice,
        media: mediaSlice,
        dashboard: dashboardSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
