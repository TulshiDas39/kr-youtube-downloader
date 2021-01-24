import { IModalReducerState, IAlertModalOptions } from "./states";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalName } from "../../../constants/constUi";

const initiallState:IModalReducerState={
  openModals:[],
}

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
    },
    openModal(state,action:PayloadAction<ModalName>){
      return {
        ...state,
        openModals:[...state.openModals,action.payload]
      }
    },
    hideModal(state,action:PayloadAction<ModalName>){
      return {
        ...state,
        openModals: state.openModals.filter(x=>x !== action.payload)
      }
    }
  }
})


export const ModalReduce = ModalSlice.reducer;
export const ActionModal = ModalSlice.actions;
