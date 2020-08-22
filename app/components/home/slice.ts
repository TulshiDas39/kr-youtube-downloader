import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHomeReducerState } from "./states";

const initialState:IHomeReducerState={
  inFetch:[]
}
const homeSlice = createSlice({
  initialState:initialState,
  name:'home',
  reducers:{
    addInFetch:(state,action:PayloadAction<string>)=>({...state,inFetch:[...state.inFetch,action.payload]}),
    removeFromFetch:(state,action:PayloadAction<string>)=>({...state,inFetch:state.inFetch.filter(x=>x !== action.payload)}),
  }
})

export const HomeReducer = homeSlice.reducer;
export const ActionHome = homeSlice.actions;
