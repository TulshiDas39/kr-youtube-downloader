import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHomeReducerState{
    inFetch:string[];
    downloadIds:string[];
  }

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
    addNewDownload:(state,action:PayloadAction<string>)=>({...state,downloadIds: [action.payload,...state.downloadIds]}),
    removeDownload:(state,action:PayloadAction<string>)=>({...state,downloadIds: state.downloadIds.filter(x => x!== action.payload)}),
  }
})

export const HomeReducer = homeSlice.reducer;
export const ActionHome = homeSlice.actions;
