import { createSlice } from '@reduxjs/toolkit'
import { MediaState } from 'src/types/types'

const initialState: MediaState = {
  media: [],
}

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
})

// eslint-disable-next-line no-empty-pattern
export const {} = mediaSlice.actions

export default mediaSlice.reducer
