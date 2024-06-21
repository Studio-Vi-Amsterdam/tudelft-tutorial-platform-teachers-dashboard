import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardInterface, DashboardPublishedInterface } from 'src/types/types'

const initialState: DashboardInterface = {
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
  },
})

export const { setPublished, deleteFromPublished, setDrafts } = dashboardSlice.actions

export default dashboardSlice.reducer
