import { configureStore } from "@reduxjs/toolkit";
import { RootReducer } from "./rootReducer";
import { useDispatch } from "react-redux";


export const ReduxStore = configureStore({
    reducer: RootReducer,
    devTools: process.env.NODE_ENV === 'development',
});

export type AppDispatch = typeof ReduxStore.dispatch
export const useDispatchTyped: () => AppDispatch = useDispatch