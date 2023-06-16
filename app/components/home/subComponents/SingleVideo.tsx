import React, { useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Image, ProgressBar, Dropdown, Button, } from "react-bootstrap";
import { IProgress, ISingleVideoDownloadFromInfo, ISingleVideoDownloadStarted, IVideoFormat, IVideoInfo } from "../../../lib";
import { ipcRenderer } from "electron";
import { Main_Events, Renderer_Events } from "../../../constants/constants";
import {FaFolderOpen} from "react-icons/fa"
import { useMultiState } from "../../common/hooks";
import { Item } from "ytpl";
import { videoFormat, videoInfo } from "ytdl-core";
import { IoMdDownload } from "react-icons/io";
import { Helper } from "../../../lib/helpers";

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
  isSelected?:boolean;
  handleSelectChange?:(isSelected:boolean)=>void;
}

interface ISingleVideoState{
  progressPercent:number;
  downloadComplete:boolean;
  fetchedInfo?:IVideoInfo;
  inProgress:boolean;
  title:string;
  thumbnailUrl:string;
  downloadPath:string;
  videoFormats:videoFormat[];
  selectedVideoFormat:IVideoFormat;
  formateText:string;
  startDownload:boolean;
  isFetching:boolean;
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
  startDownload:false,
  isFetching:false,
} as ISingleVideoState;

export function SingleVideo(props:IProps){
  const [state,setState] = useMultiState(initialState);

  const fileSizeMB = useMemo(()=>{
    if(!state.selectedVideoFormat) return 0;
    return Math.round((+state.selectedVideoFormat.contentLength) / MB);
  },[state.selectedVideoFormat?.contentLength])

  const dataRef = useRef({fileSizeMB:0,contentLength:0});

  useEffect(()=>{
    if(state.selectedVideoFormat)
      dataRef.current.contentLength = +state.selectedVideoFormat.contentLength;
  },[state.selectedVideoFormat?.contentLength])
  
  useEffect(()=>{
    dataRef.current.fileSizeMB = fileSizeMB;
  },[fileSizeMB])

  const handleFolderClick=()=>{
    ipcRenderer.send(Renderer_Events.OPEN_FOLDER,state.downloadPath);
  }

  const handleProgress=()=>{
    let progressChannel = Main_Events.HANDLE_PROGRESS_+props.id;
    if(props.playlistId) progressChannel+=props.playlistId;
    ipcRenderer.on(progressChannel,(_,progress:IProgress)=>{
      downloadedSize[props.id]+=progress.chunkSize;
      if(downloadedSize[props.id]> dataRef.current.contentLength)downloadedSize[props.id]=dataRef.current.contentLength;
      let percent = Math.round((downloadedSize[props.id]/dataRef.current.contentLength)*100);
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
    if(!props.info) {
      console.error("props.info in null");
      return;
    }
    setState({
      title:props.info.title,
      thumbnailUrl:props.info.thumbnails[0].url!,
      selectedVideoFormat:defaultVideoFormat,
    })
  }
  const handleFetchComplete=()=>{
    const findDefaultFormat=(info:IVideoInfo)=>{
      let mp4formats = info.formats.filter(x=>x.mimeType?.startsWith("video/mp4") && !x.isContentLengthCalculated );
      mp4formats.sort((a,b)=> a > b?1:-1);
      return mp4formats.find(x=> x.qualityLabel >= '360p')!;
    }

    ipcRenderer.on(Main_Events.HANDLE_SINGLE_VIDEO_FETCH_COMPLETE_+props.id,(_,info:IVideoInfo)=>{
      if(state.fetchedInfo) return;
      Helper.setContentLengthIfNotExist(info);
      const selectedFormat = findDefaultFormat(info);// info.formats.find(x=>x.itag === defaultVideoFormat.itag) || info.formats[0];
      setState({
        fetchedInfo:info,
        title:info.videoDetails.title,
        thumbnailUrl:info.videoDetails.thumbnails[0].url,
        videoFormats:info.formats,
        selectedVideoFormat:selectedFormat,
        isFetching:false,
      })
      props.onFetchComplete?.(props.id);
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
    if(!state.fetchedInfo) {
      console.error("state.fetchedInfo is undefined");
      return;
    }
    let data:ISingleVideoDownloadFromInfo={
      info:state.fetchedInfo,
      selectedVideoFormat:state.selectedVideoFormat,
      playlistId:props.playlistId,
      downloadPath:props.downloadPath,
    }
    const formateText = getFormatTex(state.selectedVideoFormat);
    setState({
      inProgress:true,
      formateText
    });
    
    handleDownloadStarted();
    handleProgress();
    handleComplete();
    ipcRenderer.send(Renderer_Events.DOWNLOAD_SINGLE_VIDEO_FROM_INFO,data);
  }
  const startFetchInfo=()=>{
    if(state.isFetching) return;
    ipcRenderer.send(Renderer_Events.FETCH_SINGLE_VIDEO_INFO, props.id);
    setState({isFetching:true});
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
    if(state.startDownload && !!state.fetchedInfo) {
      startDownloadVideo()
    }
  },[state.startDownload,state.fetchedInfo])

  useEffect(()=>{
    if(props.startDownload && state.downloadComplete) props.onComplete?.(props.id);
    else if(props.startDownload) setState({startDownload:true});
  },[props.startDownload])

  useEffect(()=>{
    if(props.startFetch && state.fetchedInfo) props.onFetchComplete?.(props.id);
    else if(props.startFetch) startFetchInfo();
  },[props.startFetch])
  
  const hanldeFormateSelectionToogle=(isOpen:boolean)=>{
    if(!isOpen) return;
    if(!!state.fetchedInfo)return;
    if(state.isFetching)return;
    startFetchInfo();
  }

  if(!props.info && !state.title) return <p>Fetching...</p>
    return(
      <Container className="border">
        <Row className="no-gutters " style={{height:maxHeight}}>
          <Col xs={3} className="my-auto h-100">
            <div className="d-flex h-100">
              {!!props.playlistId && <div>
                    <input id="selectAll" type="checkbox" checked={props.isSelected} onChange={()=>props.handleSelectChange?.(!props.isSelected)} className="pt-1" />
              </div>}
              <div className="flex-grow-1 h-100">
                <Image src={state.thumbnailUrl} rounded className="w-100 h-100" />
              </div>
            </div>
            
          </Col>
          <Col xs={6} className="h-100">
            <div className="d-flex flex-column">
              <div className="h-100">
                <p className="smal">{state.title}</p>
              </div>
            </div>
          </Col>
          <Col xs={3} className="h-100">
            {!!state.inProgress && <p className="mb-0">{( Math.round(downloadedSize[props.id]/MB))}MB of {fileSizeMB} MB</p>}
            {!state.inProgress && !state.downloadComplete && <div>
              <Dropdown onToggle={(isOpen)=>hanldeFormateSelectionToogle(isOpen)}>
                <Dropdown.Toggle className="bg-success" >
                  {getFormatTex(state.selectedVideoFormat)}
                </Dropdown.Toggle>
                <Dropdown.Menu className="formate-selection">
                  {state.videoFormats?.map((x,index)=>(
                    <Dropdown.Item key={index+""} onClick={()=>setState({selectedVideoFormat:x})}>
                      {getFormatTex(x)}
                    </Dropdown.Item>
                  ))}
                  {state.isFetching &&
                    <Dropdown.Item>Fetching...</Dropdown.Item>
                  }
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
              <Button className="ml-1 mt-1 small" type="button" title="Download" onClick={()=>setState({startDownload:true})}><IoMdDownload /></Button>
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

