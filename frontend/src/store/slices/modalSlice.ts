import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAlertModalOptions, IModalReducerState } from "../../components/common/Modals/states"
import { ModalName } from "../../lib/constants"

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
  
  
  export const ModalReducer = ModalSlice.reducer;
  export const ActionModal = ModalSlice.actions;