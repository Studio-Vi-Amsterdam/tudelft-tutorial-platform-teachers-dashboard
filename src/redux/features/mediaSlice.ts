import { createSlice } from '@reduxjs/toolkit'
import { MediaState } from 'src/types/types'

const initialState: MediaState = {
  media: [
    {
      format: 'jpeg',
      link: 'https://alt.viamsterdam.dev/tudelft-tutorials-staging/app/uploads/2024/06/62ca4db5-b2f0-49bd-9458-45246ef4f662.jpeg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'image',
    },
    {
      format: 'jpeg',
      link: 'https://alt.viamsterdam.dev/tudelft-tutorials-staging/app/uploads/2024/06/09e5deca87231e210a8ef73e1706ec56.jpeg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'image',
    },
    {
      format: 'jpeg',
      link: 'https://alt.viamsterdam.dev/tudelft-tutorials-staging/app/uploads/2024/06/043b2b90-da43-47c0-bb1f-c2ede25a70f0.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'image',
    },
    {
      format: 'jpeg',
      link: 'https://alt.viamsterdam.dev/tudelft-tutorials-staging/app/uploads/2024/06/1c662015716bffdfa464cf12338eb2f2_Plate.png',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'image',
    },
    {
      format: 'jpeg',
      link: 'https://alt.viamsterdam.dev/tudelft-tutorials-staging/app/uploads/2024/06/Beyond3d_N-Nymoen-1.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'image',
    },
    {
      format: 'jpeg',
      link: 'https://alt.viamsterdam.dev/tudelft-tutorials-staging/app/uploads/2024/06/Beyond3d_C-Monteiro-1.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'image',
    },
    {
      format: 'avi',
      link: '/img/mediaLib/videoPreview/1.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'video',
    },
    {
      format: 'mp4',
      link: '/img/mediaLib/videoPreview/2.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'video',
    },
    {
      format: 'mp4',
      link: '/img/mediaLib/videoPreview/3.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'video',
    },
    {
      format: 'avi',
      link: '/img/mediaLib/videoPreview/1.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'video',
    },
    {
      format: 'mp4',
      link: '/img/mediaLib/videoPreview/2.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'video',
    },
    {
      format: 'mp4',
      link: '/img/mediaLib/videoPreview/3.jpg',
      publishDate: new Date().toISOString(),
      title: 'Title test',
      type: 'video',
    },
  ],
}

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
})

// eslint-disable-next-line no-empty-pattern
export const {} = mediaSlice.actions

export default mediaSlice.reducer
