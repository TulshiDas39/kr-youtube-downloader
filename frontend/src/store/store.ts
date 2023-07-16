import { AnyAction, Store, configureStore } from "@reduxjs/toolkit";
import {ReactReduxContextValue, createSelectorHook} from 'react-redux';
import { ReduxState, RootReducer } from "./rootReducer";




export const ReduxStore = configureStore({
    reducer: RootReducer,
    devTools: process.env.NODE_ENV === 'development',
});

export interface IKirbyContext extends ReactReduxContextValue<ReduxState,AnyAction> {
  
}


const startingContext: IKirbyContext = { store: ReduxStore,
    noopCheck:"once",
    stabilityCheck:"always",    
};


export const useSelectorTyped = createSelectorHook(startingContext);