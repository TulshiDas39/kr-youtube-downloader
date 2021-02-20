import React, { useEffect } from "react";
import { Container, Row, Col, Image, ProgressBar, Dropdown, Button, } from "react-bootstrap";
import { IProgress, ISingleVideo, ISingleVideoDownloadFromInfo } from "../../../lib";
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
  fetchedInfo?:videoInfo;
  inProgress:boolean;
  fileSizeMB:number;
  title:string;
  // duration:string;
  thumbnailUrl:string;
  contentLength:number;
  downloadPath:string;
  videoFormats?:videoFormat[];
  selectedVideoFormat:videoFormat;
}

const initialState = {
  progressPercent:0,
  inProgress:false,
  fileSizeMB:0,
  thumbnailUrl:"",
  title:"",
  downloadPath:"",
  contentLength:0,

} as ISingleVideoState;
const defaultFormate = 18;
export function SingleVideo(props:IProps){
  const [state,setState] = useMultiState(initialState);

  const handleFolderClick=()=>{
    ipcRenderer.send(Renderer_Events.OPEN_FOLDER,state.downloadPath);
  }

  const handleProgress=()=>{
    console.log('handleProgress');
    let progressChannel = Main_Events.HANDLE_PROGRESS_+props.id;
    if(props.playlistId) progressChannel+=props.playlistId;
    console.log(progressChannel);
    ipcRenderer.on(progressChannel,(_,progress:IProgress)=>{
      downloadedSize[props.id]+=progress.chunkSize;
      console.log(state.contentLength);
      // const increased = state.contentLengthInNumber - downloadedSize[props.id];
      const percent = Math.round((downloadedSize[props.id]/state.contentLength)*100);
      console.log(percent);
      if(state.progressPercent < percent) setState({progressPercent:percent});
    })
  }

  const handleComplete=()=>{
    let completeChannel = Main_Events.HANDLE_COMPLETE_+props.id;
    if(props.playlistId)completeChannel+=props.playlistId;
    ipcRenderer.on(completeChannel,(_,progress:IProgress)=>{
        console.log('onComplete');
        setState({downloadComplete:true,inProgress:false,progressPercent:100});
        props.onComplete?.(props.id);      
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
  const handleFetchComplete=()=>{
    ipcRenderer.on(Main_Events.HANDLE_SINGLE_VIDEO_FETCH_COMPLETE_+props.id,(_,info:videoInfo)=>{
      const selectedFormat = info.formats.find(x=>x.itag === defaultFormate) || info.formats[0];
      setState({
        fetchedInfo:info,
        title:info.videoDetails.title,
        thumbnailUrl:info.videoDetails.thumbnails[0].url,
        videoFormats:info.formats,
        contentLength: Number(selectedFormat.contentLength),
        selectedVideoFormat:selectedFormat,
      })
    })
  }
  // const setProgressUpdater=()=>{
  //   progressIimers[props.id] = setInterval(setProgress,500);
  // }
  const startDownload=()=>{
    if(!state.fetchedInfo) throw "state.fetchedInfo is undefined";
    let data:ISingleVideoDownloadFromInfo={
      info:state.fetchedInfo,
      selectedVideoFormat:state.selectedVideoFormat,
    }
    setState({inProgress:true,contentLength:Number(state.selectedVideoFormat.contentLength)});
    // setProgressUpdater();
    handleProgress();
    handleComplete();
    ipcRenderer.send(Renderer_Events.DOWNLOAD_SINGLE_VIDEO_FROM_INFO,data);
  }
  useEffect(()=>{
    if(!props.info) {
      downloadedSize[props.id]=0;
      ipcRenderer.send(Renderer_Events.FETCH_SINGLE_VIDEO_INFO, props.id);
      handleFetchComplete();
    }
    else showInfoFromProps();
  },[])

  useEffect(()=>{
    if(props.startDownload) ipcRenderer.send(Renderer_Events.START_DOWNLOAD, props.id);
  },[props.startDownload])

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
            {!!state.selectedVideoFormat && <div>
              <Dropdown>
                <Dropdown.Toggle>
                  {state.selectedVideoFormat.container}-{state.selectedVideoFormat.itag}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {state.videoFormats?.map((x,index)=>(
                    <Dropdown.Item key={index+""} onClick={()=>setState({selectedVideoFormat:x})}>
                      {x.container}-{x.itag}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div> }
            {state.downloadComplete &&
              <div>
              <FaFolderOpen className="cursor-pointer h2" onClick={handleFolderClick} />
            </div>}
            {
              !state.inProgress && !!state.selectedVideoFormat && !state.downloadComplete &&
              <Button className="ml-1" type="button" onClick={startDownload}><IoMdDownload /></Button>
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

