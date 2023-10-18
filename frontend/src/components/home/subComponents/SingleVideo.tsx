import { useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Image, ProgressBar, Dropdown, Button, } from "react-bootstrap";
import {FaFolderOpen} from "react-icons/fa"
import { IoMdDownload } from "react-icons/io";
import { Helper, IpcUtils, useMultiState } from "../../../lib";
import { IPlaylistItem, IProgress, ISingleVideoDownloadFromInfo, IVideoFormat, IVideoInfo } from "common_library";

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
} as IVideoFormat;

interface IProps{
  id:string;
  info?:IPlaylistItem;
  startDownload?:boolean;
  // startFetch?:boolean;
  playlistId?:string;
  onComplete?:(id:string)=>void;  
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
  videoFormats:IVideoFormat[];
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
    IpcUtils.openFolder(state.downloadPath);    
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

  const getFormatTex=(selectedVideoFormat: IVideoFormat)=>{
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

    const handleProgress =(progress:IProgress)=>{
      downloadedSize[props.id]+=progress.chunkSize;
      if(downloadedSize[props.id]> dataRef.current.contentLength)downloadedSize[props.id]=dataRef.current.contentLength;
      let percent = Math.round((downloadedSize[props.id]/dataRef.current.contentLength)*100);
      if(percent > 100) percent = 100;
      if(state.progressPercent < percent) setState({progressPercent:percent});
    }

    const handleEnd = ()=>{
      setState({downloadComplete:true,inProgress:false,progressPercent:100});
      props.onComplete?.(props.id);
    }

    IpcUtils.startVideoDownload(data,handleProgress, handleEnd).then(res => {    
      setState({downloadPath:res.downloadPath});    
    });
        
  }
  const startFetchInfo=()=>{
    if(state.isFetching) return;
    
    const findDefaultFormat=(info:IVideoInfo)=>{
      let filteredVideos:IVideoFormat[] = info.formats.slice();
      const mp4formats = info.formats.filter(x=> x.mimeType?.startsWith("video/mp4") && x.hasVideo);

      if(mp4formats.length)
        filteredVideos = mp4formats;
      
      const videosWithAccurateFileSize = filteredVideos.filter(x => !x.isContentLengthCalculated);
      if(videosWithAccurateFileSize.length)
          filteredVideos = videosWithAccurateFileSize;
      
      const videosWithAtLestMediumQuality = filteredVideos.filter(x=> x.qualityLabel >= '360p');
      if(videosWithAtLestMediumQuality.length)
        filteredVideos = videosWithAtLestMediumQuality;

      filteredVideos.sort((a,b)=> a.qualityLabel > b.qualityLabel ?1:-1);
      return filteredVideos[0];
    }

    IpcUtils.fetchVideoInfo(props.id).then(info=>{
      if(state.fetchedInfo) return;
      info.formats = info.formats.filter(x=>x.hasAudio);
      if(!info.formats.length) 
        return ;
      Helper.setContentLengthIfNotExist(info);
      const selectedFormat = findDefaultFormat(info);
      setState({
        fetchedInfo:info,
        title:info.videoDetails.title,
        thumbnailUrl:info.videoDetails.thumbnails[0].url,
        videoFormats:info.formats,
        selectedVideoFormat:selectedFormat,
        isFetching:false,
      })      
    });

    setState({isFetching:true});
  }
  useEffect(()=>{
    downloadedSize[props.id]=0;
    if(props.info) {
      // startFetchInfo();
      showInfoFromProps();
    }
    else{
      startFetchInfo();
    }

  },[])

  useEffect(()=>{
    if(state.startDownload) {
      if(state.fetchedInfo){
        startDownloadVideo()
      }
      else {
        startFetchInfo();
      }
    }
  },[state.startDownload,state.fetchedInfo])

  useEffect(()=>{
    if(props.startDownload) setState({startDownload:true});
  },[props.startDownload])

  useEffect(()=>{
    if(state.downloadComplete)
      props.onComplete?.(props.id);
  },[state.downloadComplete])  
  
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
            <div className="d-flex h-100 align-items-center">
              {!!props.playlistId && <div>
                    <input id="selectAll" type="checkbox" checked={props.isSelected} onChange={()=>props.handleSelectChange?.(!props.isSelected)} className="pt-1" />
                    {!state.startDownload && <span className="ps-2">Pending...</span>}
              </div>}
              {(!props.playlistId || state.startDownload) && <div className="flex-grow-1 h-100">
                <Image src={state.thumbnailUrl} rounded className="w-100 h-100" />
              </div>}
              
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

