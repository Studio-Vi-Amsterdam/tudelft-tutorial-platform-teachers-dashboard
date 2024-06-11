import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ArtictesType,
    DashboardInterface,
    DashboardPublishedInterface,
} from 'src/types/types';

const initialState: DashboardInterface = {
    username: '',
    drafts: [],
    published: [],
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setPublished: (
            state,
            action: PayloadAction<DashboardPublishedInterface[]>
        ) => {
            state.published = action.payload;
        },
    },
});

export const { setPublished } = dashboardSlice.actions;

export default dashboardSlice.reducer;
