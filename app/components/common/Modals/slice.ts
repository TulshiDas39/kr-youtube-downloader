import { IModalReducerState, IAlertModalOptions } from "./states";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initiallState:IModalReducerState={}

const ModalSlice = createSlice({
  initialState:initiallState,
  name:'modals',
  reducers:{
    showAlertModal(state,action:PayloadAction<IAlertModalOptions>){
      return {
        ...state,
        alertModal:action.payload,
      }
    },
    hideAlertModal(state){
      return {
        ...state,
        alertModal:undefined
      }
    }
  }
})


export const ModalReduce = ModalSlice.reducer;
export const ActionModal = ModalSlice.actions;
