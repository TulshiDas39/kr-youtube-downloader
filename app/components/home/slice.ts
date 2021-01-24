import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHomeReducerState } from "./states";

const initialState:IHomeReducerState={
  inFetch:[],
  downloadIds:[],
}
const homeSlice = createSlice({
  initialState:initialState,
  name:'home',
  reducers:{
    addInFetch:(state,action:PayloadAction<string>)=>({...state,inFetch:[...state.inFetch,action.payload]}),
    removeFromFetch:(state,action:PayloadAction<string>)=>({...state,inFetch:state.inFetch.filter(x=>x !== action.payload)}),
    addNewDownload:(state,action:PayloadAction<string>)=>({...state,downloadIds: [...state.downloadIds,action.payload]}),
    removeDownload:(state,action:PayloadAction<string>)=>({...state,downloadIds: state.downloadIds.filter(x => x!== action.payload)}),
  }
})

export const HomeReducer = homeSlice.reducer;
export const ActionHome = homeSlice.actions;
