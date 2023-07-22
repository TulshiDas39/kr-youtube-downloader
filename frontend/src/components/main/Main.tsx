import { RendererEvents,RepositoryInfo } from "common_library";
import React from "react";
import { useEffect } from "react";
import {useDispatch,shallowEqual, batch} from "react-redux";
import { useMultiState } from "../../lib";
import { useSelectorTyped } from "../../store/rootReducer";
import { ActionSavedData } from "../../store/slices";
import { ActionUI, EnumHomePageTab } from "../../store/slices/UiSlice";
import { Home } from "../home/Home";


interface IState{
    isLoading:boolean;
}

const initialState = {
    isLoading:true,
} as IState;

function MainComponent(){
    const dispatch = useDispatch();
    const store = useSelectorTyped(state=>({
        selectedRepo:state.savedData.recentRepositories.find(x=>x.isSelected)
    }),shallowEqual);
    const [state,setState] = useMultiState(initialState);
    
    useEffect(()=>{
        
        setState({isLoading:false});
    },[]);
    if(state.isLoading) return null;
    return <div className="h-100">
        <Home />
    </div>
}

export const Main = React.memo(MainComponent);