import { IpcUtils, useMultiState } from "../../../lib";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaAngleDown, FaAngleUp, FaDownload } from "react-icons/fa";
import { useEffect } from "react";
import { SingleVideo } from "./SingleVideo";
import React from "react";
import { IPlaylistFetchResult, IPlaylistItem } from "common_library";


interface IPlaylistDownloadProps {
    id:string;
}

export interface IPlaylistDownloadState{
    expanded:boolean,
    info?:IPlaylistFetchResult,
    donloadPath:string,
    isDownloading:boolean,
    fetchingItem?:IPlaylistItem,
    downloadingItem?:IPlaylistItem,
    completedIds:string[];
    isAllSelected:boolean;
    selectedVideoIds:string[]
}

function PlaylistDownloadComponent(props:IPlaylistDownloadProps){
    const maxHeight = '5rem';
    const [state,setState] = useMultiState<IPlaylistDownloadState>({
        expanded:true,
        isDownloading:false,
        donloadPath:"",
        completedIds:[],
        isAllSelected:true,
        selectedVideoIds:[],
    })

    const changeSelection=(id:string,isSelected:boolean)=>{
        let selectedVideoIds = [...state.selectedVideoIds,id];
        if(!isSelected) selectedVideoIds = state.selectedVideoIds.filter(x=>x !== id);
        setState({selectedVideoIds});
    }

    const downloadNextVideo=()=>{
        if(!state.info) return;
        let downloadingIndex = state.info.items.findIndex(x=>x.id === state.downloadingItem?.id);
        do{
          downloadingIndex++;
          if(downloadingIndex >= state.info.items.length) return;
        }while(!canDownload(state.info.items[downloadingIndex].id));
        setState({downloadingItem:state.info.items[downloadingIndex]});    
    }

    const handleSingleVideoDownloadComplete=(item:IPlaylistItem)=>{
        if(!state.completedIds.includes(item.id)) {
          setState({completedIds:[...state.completedIds,item.id]});
        }
        downloadNextVideo();
      }
      const setIsAllSelected=(isAllSelected:boolean)=>{
        const selectedVideoIds = isAllSelected?state.info?.items.map(x=>x.id) || []:[];
        setState({isAllSelected,selectedVideoIds});
      }

      const startDownload=()=>{
        setState({isDownloading:true,downloadingItem:undefined});
      }

      useEffect(()=>{
        if(state.isDownloading){
            downloadNextVideo();
        }
      },[state.isDownloading])

      const handleExpansion=()=>{
        setState({expanded:!state.expanded});
      }

      const canDownload=(id:string)=>{
        if(!state.info) return false;
        if(!state.selectedVideoIds.includes(id))return false;
        if(state.completedIds.includes(id)) return false;
        return true;
      }    
    
      const fetchPlaylistInfo=()=>{
        IpcUtils.fetchPlaylistInfo(props.id).then(data=>{
          setState({
            info:data.result,donloadPath:data.downloadPath,
            fetchingItem:data.result.items[0]
          });
        });        
      }         

      useEffect(()=>{
        if(state.info)
            setIsAllSelected(true);
      },[state.info])
    
    const handleSelectionChange=()=>{
         const isAllSelected = state.selectedVideoIds.length === state.info?.items.length;
         setState({isAllSelected})
    }
    
    useEffect(()=>{
          handleSelectionChange();
    },[state.selectedVideoIds]);

    useEffect(()=>{
        fetchPlaylistInfo();        
    },[])

    if(!state.info) return <p>Fetching info...</p>

    return (
        <Container className="border">
          <Row className="no-gutters overflow-hidden" style={{maxHeight:maxHeight}}>
            <Col xs={3} className="my-auto" style={{maxHeight:maxHeight}}>
              <div className="d-flex align-items-center justify-content-center" >
                  <span>
                    <label htmlFor="selectAll" className="mr-1">All</label>
                    <input id="selectAll" type="checkbox" checked={!!state.isAllSelected} onChange={()=>setIsAllSelected(!state.isAllSelected)} className="pt-1" />
                  </span>
              </div>
              {/* <Image src={this.props.downloadInfo.playList?.info.} rounded className="w-100" /> */}
            </Col>
            <Col xs={6} style={{maxHeight:maxHeight}}>
              <div className="d-flex flex-column">
                <div className="h-100">
                  <p className="smal">{state.info.title}</p>
                </div>
              </div>
            </Col>
            <Col xs={3} style={{maxHeight:maxHeight}}>
              <Row>
                <Col xs={2}></Col>
                <Col xs={8}>
                  <div style={{flexGrow:7}}>
                    <p className="mb-0">{state.completedIds.length} of {state.info.items.length}</p>
                    {state.completedIds.length !== state.info.items.length &&
                    <Button className="ml-1" type="button" title="Start download" disabled={!state.selectedVideoIds.length} onClick={startDownload}><FaDownload /></Button>}
                  </div>                  
                </Col>
                <Col xs={2} className="d-flex align-items-center">
                  <span className="cursor-pointer" onClick={handleExpansion} title={state.expanded?"Collapse list":"Expande list"}>
                        {
                          state.expanded? <FaAngleUp />:<FaAngleDown />
                        }
                  </span>                  
                </Col>                
              </Row>          
            </Col>
          </Row>
          <div className={`row ${state.expanded?'':'d-none'}`} style={{borderTop:'5px solid green'}}>
                {
                  state.info.items.map(v=>(
                    <SingleVideo key={v.id} onComplete={()=>handleSingleVideoDownloadComplete(v)} id={v.id} playlistId={props.id}
                       info={v} startDownload={state.downloadingItem?.id === v.id}
                       downloadPath={state.donloadPath} isSelected={state.selectedVideoIds.includes(v.id)}
                       handleSelectChange={(isSelected)=>changeSelection(v.id,isSelected)} />
                  ))
                }
          </div>
        </Container>
    )
}

export const PlaylistDownload = React.memo(PlaylistDownloadComponent);