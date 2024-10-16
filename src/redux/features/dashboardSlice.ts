import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardInterface, DashboardPublishedInterface } from 'src/types/types'

const initialState: DashboardInterface = {
  isDraftsLoaded: false,
  isPublishedLoaded: false,
  username: '',
  drafts: [],
  published: [],
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPublished: (state, action: PayloadAction<DashboardPublishedInterface[]>) => {
      state.published = action.payload
    },
    setDrafts: (state, action: PayloadAction<DashboardPublishedInterface[]>) => {
      state.drafts = action.payload
    },
    deleteFromPublished: (state, action: PayloadAction<number>) => {
      state.published = state.published.filter((item) => item.id !== action.payload)
    },
    deleteFromDrafts: (state, action: PayloadAction<number>) => {
      state.drafts = state.drafts.filter((item) => item.id !== action.payload)
    },
    setDashboardFetched: (
      state,
      action: PayloadAction<{ row: 'published' | 'drafts'; value: boolean }>,
    ) => {
      const { row, value } = action.payload
      if (row === 'drafts') {
        state.isDraftsLoaded = value
      } else if (row === 'published') {
        state.isPublishedLoaded = value
      }
    },
  },
})

export const {
  setPublished,
  deleteFromPublished,
  setDrafts,
  deleteFromDrafts,
  setDashboardFetched,
} = dashboardSlice.actions

export default dashboardSlice.reducer
