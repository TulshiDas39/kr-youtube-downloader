import { RendererEvents,RepositoryInfo } from "common_library";
import React from "react";
import { useEffect } from "react";
import {useDispatch,shallowEqual, batch} from "react-redux";
import { useMultiState } from "../../lib";
import { useSelectorTyped } from "../../store/rootReducer";
import { ActionSavedData } from "../../store/slices";
import { ActionUI, EnumHomePageTab } from "../../store/slices/UiSlice";


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
        const repos:RepositoryInfo[] =  window.ipcRenderer.sendSync(RendererEvents.getRecentRepositoires); 
        console.log('repos',repos);
        if(!repos?.length){
            setState({isLoading:false});
            dispatch(ActionUI.setHomePageTab(EnumHomePageTab.Open));
            return;
        }
        const sortedRepos = repos.sort((x1,x2)=> (x1.lastOpenedAt ?? "") > (x2.lastOpenedAt ?? "") ?-1:1);
        batch(()=>{
            
            dispatch(ActionSavedData.setRecentRepositories(sortedRepos));
            if(!repos.length) dispatch(ActionUI.setHomePageTab(EnumHomePageTab.Open));
        });
        setState({isLoading:false});
    },[]);
    if(state.isLoading) return null;
    return <div className="h-100">
        <div>Main page</div>
    </div>
}

export const Main = React.memo(MainComponent);