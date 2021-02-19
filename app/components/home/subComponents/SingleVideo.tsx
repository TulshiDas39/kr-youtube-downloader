import React, { useEffect, useMemo } from "react";
import { Container, Row, Col, Image, ProgressBar, } from "react-bootstrap";
import { IProgress, ISingleVideo } from "../../../lib";
import { ipcRenderer } from "electron";
import { Main_Events, Renderer_Events } from "../../../constants/constants";
import {FaFolderOpen} from "react-icons/fa"
import { useMultiState } from "../../common/hooks";
import { Item } from "ytpl";

const imgSrc = "https://cloudfour.com/examples/img-currentsrc/images/kitten-large.png";
const downloadedSize:{[name:string]:number}={};
const maxHeight='5rem';
const MB = 1024*1024;
// const fileSize = parseInt(this.props.singleVideo.singleVideoInfo?.format.contentLength!);
// const fileSizeMB = Math.round(fileSize / this.MB);

interface IProps{
  id:string;
  info?:Item;
  startDownload?:boolean;
  // singleVideo:IDownload;
  playlistId?:string;
  onComplete?:(id:string)=>void;
}

interface ISingleVideoState{
  progressPercent:number;
  downloadComplete?:boolean;
  // fetchedInfo:ISingleVideo;
  inProgress:boolean;
  fileSizeMB:number;
  title:string;
  // duration:string;
  thumbnailUrl:string;
  contentLength:string;
  downloadPath:string;
  
}

const initialState = {
  progressPercent:0,
  inProgress:false,
  fileSizeMB:0,
  thumbnailUrl:"",
  title:"",
  downloadPath:"",
  contentLength:"",

} as ISingleVideoState;

export function SingleVideo(props:IProps){
  const [state,setState] = useMultiState(initialState);


  const setProgress=()=>{
    const progresss =  downloadedSize[props.id]/Number(state.contentLength);
    setState({progressPercent: Math.round(progresss*100)});
  }

  const progressInterval = useMemo(()=>{
    if(state.inProgress) return setInterval(setProgress,500);
    return null;
  },[state.inProgress]);

  const handleFolderClick=()=>{
    ipcRenderer.send(Renderer_Events.OPEN_FOLDER,state.downloadPath);
  }

  const handleProgress=()=>{
    ipcRenderer.on(Main_Events.HANDLE_PROGRESS+props.id,(e,progress:IProgress)=>{
      downloadedSize[props.id]+=progress.chunkSize;
    })
  }

  const handleComplete=()=>{
    ipcRenderer.on(Main_Events.HANDLE_COMPLETE+props.id,(e,progress:IProgress)=>{
        if(progress) clearInterval(progressInterval as any);
        setState({downloadComplete:true,inProgress:false,progressPercent:100});
        // this.props.onComplete(this.props.singleVideo.id);
      
    })
  }

  const handleNewDownload=()=>{
    ipcRenderer.on(Main_Events.ADD_SINGLE_DOWNLOAD_ITEM+props.id,(_,item:ISingleVideo)=>{
      //  const downloadItem:IDownload={
      //    id:item.info.videoDetails.videoId,
      //    singleVideoInfo:item,
      //    inProgress:true
      //  }
      const fileSize = parseInt(item.format.contentLength);
      const fileSizeMB = Math.round(fileSize / MB);

       downloadedSize[props.id] = 0;
       handleProgress();
      //  setState({fetchedInfo:item,fileSizeMB:fileSizeMB});
      setState({
        contentLength:item.format.contentLength,
        downloadPath:item.downloadPath,
        thumbnailUrl:item.info.videoDetails.thumbnails[0].url,
        fileSizeMB:fileSizeMB
      })
       handleComplete();
    })
  }

  const showInfoFromProps=()=>{
    if(!props.info) throw "props.info in null";
    console.log(props.info);
    setState({
      title:props.info.title,
      thumbnailUrl:props.info.thumbnails[0].url!,      
    })
  }

  useEffect(()=>{
    handleNewDownload();
    if(!props.info) ipcRenderer.send(Renderer_Events.START_DOWNLOAD, props.id);
    else showInfoFromProps();
  },[])

  useEffect(()=>{
    if(props.startDownload) ipcRenderer.send(Renderer_Events.START_DOWNLOAD, props.id);
  },[props.startDownload])
  // componentDidMount(){

  //   console.log('mounting');
  //   handleProgress();
  //   this.progressInterval = setInterval(this.setProgress,500);
  //   this.handleComplete();
  //   // this.handleException();
  // }

    return(
      <Container className="border">
        <Row className="no-gutters overflow-hidden" style={{maxHeight:maxHeight}}>
          <Col xs={3} className="my-auto" style={{maxHeight:maxHeight}}>
            <Image src={state.thumbnailUrl} rounded className="w-100" />
          </Col>
          <Col xs={6} style={{maxHeight:maxHeight}}>
            <div className="d-flex flex-column">
              <div className="h-100">
                <p className="smal">{state.title}</p>
              </div>
            </div>
          </Col>
          <Col xs={3} style={{maxHeight:maxHeight}}>
            {!!state.inProgress && <p className="mb-0">{( Math.round(downloadedSize[props.id]/MB))}MB of {state.fileSizeMB} MB</p>}
            {state.downloadComplete &&
              <div>
              <FaFolderOpen className="cursor-pointer h2" onClick={handleFolderClick} />
            </div>}
          </Col>
        </Row>
        {state.inProgress &&
          <div className="d-flex w-100">
            <ProgressBar className="w-100" animated variant="success" now={state.progressPercent} key={1}  label={state.progressPercent+"%"} />
          </div>}
      </Container>
    )
  }

