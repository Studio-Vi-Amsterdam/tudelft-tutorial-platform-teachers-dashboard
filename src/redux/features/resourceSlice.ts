import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'
import type { ResourceAcfPayload, ResourcePerson } from '@/types/types'

const emptyPerson = (): ResourcePerson => ({
  author: '',
  orcid: '',
})

const initialState: ResourceAcfPayload = {
  title: '',
  faculty: [],
  resource__authors: [emptyPerson()],
  resource__editors: [],
  keywords: [],
  resource__pdf: {
    id: 0,
    url: '',
    isValid: false
  },
  resource__publisher: '',
  resource__license: '',
  resource__doi: '',
  resource__content: {
    subtitle: '',
    publication_date: '',
    abstract: '',
    recommended_citation: '',
    references: '',
  },
}

type PeopleKey = 'resource__authors' | 'resource__editors'
type ContentKey = keyof ResourceAcfPayload['resource__content']

export const resourceSlice = createSlice({
  name: 'resourceSlice',
  initialState,
  reducers: {
    resetResourceAcf: () => initialState,

    hydrateResourceAcf: (_state, action: PayloadAction<Partial<ResourceAcfPayload>>) => {
      return {
        ...initialState,
        ...action.payload,
        resource__content: {
          ...initialState.resource__content,
          ...(action.payload.resource__content ?? {}),
        },
      }
    },

    setField: <K extends keyof ResourceAcfPayload>(
      state: ResourceAcfPayload,
      action: PayloadAction<{ key: K; value: ResourceAcfPayload[K] }>
    ) => {
      state[action.payload.key] = action.payload.value
    },

    setContentField: (state, action: PayloadAction<{ key: ContentKey; value: string }>) => {
      state.resource__content[action.payload.key] = action.payload.value
    },
  },
})

export const {
  hydrateResourceAcf,
  resetResourceAcf,
  setContentField,
  setField,
} = resourceSlice.actions

export default resourceSlice.reducer

export const selectResource = (state: RootState) => state.resource
