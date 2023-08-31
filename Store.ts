import { configureStore } from '@reduxjs/toolkit'
import { NoteSlice } from './Redux/NoteSlice';

// nav for navigation 
export const Store = configureStore({
    reducer:{
        note: NoteSlice.reducer, 
    }
});

export type RootState = ReturnType<typeof Store.getState>
