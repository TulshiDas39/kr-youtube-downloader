import React, { useEffect } from "react";
import { Container, Row, Col, Image, ProgressBar, Dropdown, Button, } from "react-bootstrap";
import { IProgress, ISingleVideoDownloadFromInfo, ISingleVideoDownloadStarted } from "../../../lib";
import { ipcRenderer } from "electron";
import { Main_Events, Renderer_Events } from "../../../constants/constants";
import {FaFolderOpen} from "react-icons/fa"
import { useMultiState } from "../../common/hooks";
import { Item } from "ytpl";
import { videoFormat, videoInfo } from "ytdl-core";
import { IoMdDownload } from "react-icons/io";

const imgSrc = "https://cloudfour.com/examples/img-currentsrc/images/kitten-large.png";
const downloadedSize:{[name:string]:number}={};
const maxHeight='5rem';
const MB = 1024*1024;
// const fileSize = parseInt(this.props.singleVideo.singleVideoInfo?.format.contentLength!);
// const fileSizeMB = Math.round(fileSize / this.MB);
const defaultVideoFormat={
  itag:18,
  container:'mp4',
  qualityLabel:"360p",
  mimeType:"video/mp4",
} as videoFormat;
interface IProps{
  id:string;
  info?:Item;
  startDownload?:boolean;
  startFetch?:boolean;
  playlistId?:string;
  onComplete?:(id:string)=>void;
  onFetchComplete?:(id:string)=>void;
  downloadPath?:string;
}

interface ISingleVideoState{
  progressPercent:number;
  downloadComplete:boolean;
  fetchedInfo?:videoInfo;
  inProgress:boolean;
  fileSizeMB:number;
  title:string;
  thumbnailUrl:string;
  contentLength:number;
  downloadPath:string;
  videoFormats:videoFormat[];
  selectedVideoFormat:videoFormat;
  formateText:string;
}

const initialState = {
  progressPercent:0,
  inProgress:false,
  fileSizeMB:0,
  thumbnailUrl:"",
  downloadComplete:false,
  title:"",
  downloadPath:"",
  contentLength:0,
  videoFormats:[],
  selectedVideoFormat:defaultVideoFormat,
  formateText:"",
} as ISingleVideoState;

export function SingleVideo(props:IProps){
  const [state,setState] = useMultiState(initialState);

  const handleFolderClick=()=>{
    ipcRenderer.send(Renderer_Events.OPEN_FOLDER,state.downloadPath);
  }

  const handleProgress=()=>{
    let progressChannel = Main_Events.HANDLE_PROGRESS_+props.id;
    if(props.playlistId) progressChannel+=props.playlistId;
    ipcRenderer.on(progressChannel,(_,progress:IProgress)=>{
      downloadedSize[props.id]+=progress.chunkSize;
      let percent = Math.round((downloadedSize[props.id]/state.contentLength)*100);
      if(percent > 100) percent = 100;
      if(state.progressPercent < percent) setState({progressPercent:percent});
    })
  }

  const handleComplete=()=>{
    let completeChannel = Main_Events.HANDLE_COMPLETE_+props.id;
    if(props.playlistId)completeChannel+=props.playlistId;
    ipcRenderer.on(completeChannel,()=>{
        setState({downloadComplete:true,inProgress:false,progressPercent:100});
        props.onComplete?.(props.id);      
    })
  }

  const showInfoFromProps=()=>{
    if(!props.info) throw "props.info in null";
    setState({
      title:props.info.title,
      thumbnailUrl:props.info.thumbnails[0].url!,
      selectedVideoFormat:defaultVideoFormat,
    })
  }
  const handleFetchComplete=()=>{
    ipcRenderer.on(Main_Events.HANDLE_SINGLE_VIDEO_FETCH_COMPLETE_+props.id,(_,info:videoInfo)=>{
      if(state.fetchedInfo) return;
      const selectedFormat = info.formats.find(x=>x.itag === defaultVideoFormat.itag) || info.formats[0];
      const fileSize = parseInt(selectedFormat.contentLength!);
      const fileSizeMB = Math.round(fileSize / MB);
      console.log(selectedFormat);
      setState({
        fetchedInfo:info,
        title:info.videoDetails.title,
        thumbnailUrl:info.videoDetails.thumbnails[0].url,
        videoFormats:info.formats,
        contentLength: Number(selectedFormat.contentLength),
        selectedVideoFormat:selectedFormat,
        fileSizeMB:fileSizeMB,
      })
    })
  }

  const handleDownloadStarted=()=>{
    let channel = Main_Events.HANDLE_SINGLE_VIDEO_DOWNLOAD_STARTED_+props.id;
    if(props.playlistId) channel+=props.playlistId;
    ipcRenderer.on(channel,(_,data:ISingleVideoDownloadStarted)=>{
      setState({downloadPath:data.downloadPath});
    })
  }

  const getFormatTex=(selectedVideoFormat: videoFormat)=>{
    const mimeText = selectedVideoFormat.mimeType?.split(";")?.[0] || "";
    const formateText=`${mimeText}${selectedVideoFormat.qualityLabel?","+selectedVideoFormat.qualityLabel:""}`;
    return formateText;
  }
  
  const startDownloadVideo=()=>{
    if(!state.fetchedInfo) throw "state.fetchedInfo is undefined";
    let data:ISingleVideoDownloadFromInfo={
      info:state.fetchedInfo,
      selectedVideoFormat:state.selectedVideoFormat,
      playlistId:props.playlistId,
      downloadPath:props.downloadPath,
    }
    const formateText = getFormatTex(state.selectedVideoFormat);
    setState({
      inProgress:true,
      contentLength:Number(state.selectedVideoFormat.contentLength),
      formateText
    });
    
    handleDownloadStarted();
    handleProgress();
    handleComplete();
    ipcRenderer.send(Renderer_Events.DOWNLOAD_SINGLE_VIDEO_FROM_INFO,data);
  }
  const startFetchInfo=()=>{
    ipcRenderer.send(Renderer_Events.FETCH_SINGLE_VIDEO_INFO, props.id);
    handleFetchComplete();
  }
  useEffect(()=>{
    downloadedSize[props.id]=0;
    if(!props.info) {
      startFetchInfo();
    }
    else showInfoFromProps();
  },[])

  useEffect(()=>{
    if(props.startDownload && !!state.fetchedInfo) {
      startDownloadVideo()
    }
    if(state.fetchedInfo){
      props.onFetchComplete?.(props.id);
    }
  },[props.startDownload,state.fetchedInfo])

  useEffect(()=>{
    if(props.startFetch) startFetchInfo();
  },[props.startFetch])
  

  if(!props.info && !state.title) return <p>Fetching...</p>
    return(
      <Container className="border">
        <Row className="no-gutters " style={{height:maxHeight}}>
          <Col xs={3} className="my-auto h-100">
            <Image src={state.thumbnailUrl} rounded className="w-100 h-100" />
          </Col>
          <Col xs={6} className="h-100">
            <div className="d-flex flex-column">
              <div className="h-100">
                <p className="smal">{state.title}</p>
              </div>
            </div>
          </Col>
          <Col xs={3} className="h-100">
            {!!state.inProgress && <p className="mb-0">{( Math.round(downloadedSize[props.id]/MB))}MB of {state.fileSizeMB} MB</p>}
            {!state.inProgress && !state.downloadComplete && <div>
              <Dropdown>
                <Dropdown.Toggle className="bg-success">
                  {getFormatTex(state.selectedVideoFormat)}
                </Dropdown.Toggle>
                <Dropdown.Menu className="formate-selection">
                  {state.videoFormats?.map((x,index)=>(
                    <Dropdown.Item key={index+""} onClick={()=>setState({selectedVideoFormat:x})}>
                      {getFormatTex(x)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div> }
            {!!state.formateText && <p>{state.formateText}</p>}
            {state.downloadComplete &&
              <div>
              <FaFolderOpen className="cursor-pointer h2" onClick={handleFolderClick} />
            </div>}
            {
              !state.inProgress && !!state.selectedVideoFormat && !state.downloadComplete &&
              <Button className="ml-1" type="button" onClick={startDownloadVideo}><IoMdDownload /></Button>
            }
          </Col>
        </Row>
        {state.inProgress &&
          <div className="d-flex w-100">
            <ProgressBar className="w-100" animated variant="success" now={state.progressPercent} key={1}  label={state.progressPercent+"%"} />
          </div>}
      </Container>
    )
  }

