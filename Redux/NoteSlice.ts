import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";


const initialState ={
    Name: null ,
    id : null , 
     
}

export const NoteSlice = createSlice({
    name :"note",
    initialState,
    reducers:{
        setName : (state,action)=>{
            state.Name = action.payload ;
        },
        setId : (state,action)=>{
            state.id = action.payload;
        }
        
    }

});

export const {setName , setId} = NoteSlice.actions;

// selectors - to gfet data from the store-> navSlice 
// this would give the current value 

export const SelectName = (state: RootState)=> state.note.Name;
export const SelectId = (state : RootState)=> state.note.id;
export default NoteSlice.reducer;

