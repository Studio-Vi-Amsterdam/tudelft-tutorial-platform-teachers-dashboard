import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardInterface, DashboardPublishedInterface } from 'src/types/types'

const initialState: DashboardInterface = {
  isDraftsLoaded: false,
  isPublishedLoaded: false,
  isArchivedLoaded: false,
  username: '',
  drafts: [],
  archived: [],
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
    setArchived: (state, action: PayloadAction<DashboardPublishedInterface[]>) => {
      state.archived = action.payload
    },
    deleteFromPublished: (state, action: PayloadAction<number>) => {
      state.published = state.published.filter((item) => item.id !== action.payload)
    },
    deleteFromDrafts: (state, action: PayloadAction<number>) => {
      state.drafts = state.drafts.filter((item) => item.id !== action.payload)
    },
    deleteFromArchived: (state, action: PayloadAction<number>) => {
      state.archived = state.archived.filter((item) => item.id !== action.payload)
    },
    setDashboardFetched: (
      state,
      action: PayloadAction<{ row: 'published' | 'drafts' | 'archived'; value: boolean }>,
    ) => {
      const { row, value } = action.payload
      if (row === 'drafts') {
        state.isDraftsLoaded = value
      } else if (row === 'published') {
        state.isPublishedLoaded = value
      } else if (row === 'archived') {
        state.isArchivedLoaded = value
      }
    },
  },
})

export const {
  setPublished,
  deleteFromPublished,
  setDrafts,
  setArchived,
  deleteFromArchived,
  deleteFromDrafts,
  setDashboardFetched,
} = dashboardSlice.actions

export default dashboardSlice.reducer
