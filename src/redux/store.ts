import { configureStore } from '@reduxjs/toolkit'
import editorSlice from './features/editorSlice'
import mediaSlice from './features/mediaSlice'
import dashboardSlice from './features/dashboardSlice'
import resourceSlice from '@/redux/features/resourceSlice'

export const store = configureStore({
  reducer: {
    editor: editorSlice,
    media: mediaSlice,
    dashboard: dashboardSlice,
    resource: resourceSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
