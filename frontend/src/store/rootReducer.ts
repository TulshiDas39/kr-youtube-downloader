import { combineReducers } from '@reduxjs/toolkit';
import {ReactReduxContextValue, createSelectorHook} from 'react-redux';
import { ReducerSavedData } from './slices';
import { ReducerUI } from './slices/UiSlice';
import { ReduxStore } from './store';
import React from 'react';
const AppReducer = combineReducers({
    savedData:ReducerSavedData,
    ui:ReducerUI,
});

const AppResetActionType = 'app/Reset';
export const ActionAppReset = (): { type: string } => ({ type: AppResetActionType });

export const RootReducer: (...param: Parameters<typeof AppReducer>) => ReturnType<typeof AppReducer> = (state, action) => {
  if (action.type === AppResetActionType) {
    //AuthStorage.clearLoginData();
    state = undefined;
  }
  return AppReducer(state, action);
}

export type ReduxState= ReturnType<typeof AppReducer>;
// export interface IKirbyContext extends ReactReduxContextValue {
  
// }


// const startingContext: IKirbyContext = { store: kirby.redux, storeState: {} };


// export const useSelectorTyped = createSelectorHook(React.createContext<ReduxState| undefined>(undefined!));
// useSelectorTyped(state=>state.)