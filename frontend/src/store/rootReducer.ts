import { combineReducers } from '@reduxjs/toolkit';
import {EqualityFn, useSelector} from 'react-redux';
import { ReducerSavedData } from './slices';
import { ReducerUI } from './slices/UiSlice';
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

export const useSelectorTyped = <S>(selector: (state: ReduxState) => S, equalityFn?: EqualityFn<S>)=>{
  return useSelector<ReduxState,S>(selector,equalityFn);
}
