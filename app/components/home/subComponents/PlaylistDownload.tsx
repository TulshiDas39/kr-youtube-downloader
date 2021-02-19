import React from "react";
import { IFetch, ISingleVideo, IPlaylistVideo } from "../../../lib";
import { Container, Row, Col } from "react-bootstrap";
import { IPlaylistDownloadState } from "../states";
import { FaFolderOpen, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { ipcRenderer } from "electron";
import { Renderer_Events, Main_Events } from "../../../constants/constants";
import { SingleVideo } from "./SingleVideo";
import { Result } from "ytpl";

export class PlaylistDownload extends React.PureComponent<IPlaylistDownloadProps,IPlaylistDownloadState>{
  readonly maxHeight='5rem';
  state:IPlaylistDownloadState={
    currentDownloadIndex:-1,
    videoList:[],
    expanded:true,
  }
  readonly channels = {
    onFetchVideo: Main_Events.ON_SINGLE_VIDEO_INFO_FETCH_COMPLETE+this.props.id
  }
  fetchIndex = 0;
  readonly timeLimitForFetch = 30000;//second
  readonly timeLimitForDownload = 1000*60*1;//in min

  render(){
    if(!this.state.info) return <p>Fetching info...</p>
    return (
      <div>
        <Container className="border">
          <Row className="no-gutters overflow-hidden" style={{maxHeight:this.maxHeight}}>
            <Col xs={3} className="my-auto" style={{maxHeight:this.maxHeight}}>
              {/* <Image src={this.props.downloadInfo.playList?.info.} rounded className="w-100" /> */}
            </Col>
            <Col xs={6} style={{maxHeight:this.maxHeight}}>
              <div className="d-flex flex-column">
                <div className="h-100">
                  <p className="smal">{this.state.info.title}</p>
                </div>
              </div>
            </Col>
            <Col xs={3} style={{maxHeight:this.maxHeight}}>
              <div className="d-flex">
                <div style={{flexGrow:7}}>
                  <p className="mb-0">{this.state.currentDownloadIndex+1} of {this.state.info.items.length}</p>
                  {this.state.currentDownloadIndex === this.state.info.items.length &&
                  <div>
                      <FaFolderOpen className="cursor-pointer h2" />
                  </div>
                  }
                </div>
                <div className="d-flex align-items-center justify-content-center" style={{flexGrow:3}}>
                  <span className="rounded-circle p-1 hover-circle cursor-pointer" onClick={this.handleExpansion}>
                    {
                      this.state.expanded? <FaAngleUp />:<FaAngleDown />
                    }

                  </span>
                </div>
              </div>

            </Col>
          </Row>
          <div className={`row ${this.state.expanded?'':'d-none'}`} style={{border:'5px solid green'}}>
                {
                  this.state.info.items.map(v=>(
                    <SingleVideo key={v.id} onComplete={this.downloadNextVideo} id={v.id} playlistId={this.props.id} info={v} />
                  ))
                }
          </div>
        </Container>
      </div>
    )
  }

  handleExpansion=()=>{
    this.setState({expanded:!this.state.expanded});
  }
  downloadNextVideo=()=>{
    // if(this.state.currentDownloadIndex >= this.props.downloadInfo.playList?.info.items.length! - 1) return;
    // var interval = setInterval(()=>{
    //   if(this.state.currentDownloadIndex < this.state.videoList.length-1) {
    //     this.setState({currentDownloadIndex:this.state.currentDownloadIndex+ 1},this.downloadVideo);
    //     clearInterval(interval);
    //   }
    // },1000)

  }
  // handleFolderClick=()=>{
  //   ipcRenderer.send(Renderer_Events.OPEN_FOLDER,this.props.downloadInfo.playList?.downloadPath!);
  // }

  // fetchVideoInfo=()=>{
  //   console.log('fetching index:'+this.fetchIndex);
  //   const videoId = this.props.downloadInfo.playList?.info.items[this.fetchIndex].id!
  //   const data:IFetch={
  //     channel:Main_Events.ON_SINGLE_VIDEO_INFO_FETCH_COMPLETE+this.props.downloadInfo.id,
  //     videoId:videoId,
  //     playlistPath:this.props.downloadInfo.playList?.downloadPath
  //   }
  //   ipcRenderer.send(Renderer_Events.FETCH_SINGLE_VIDEO_INFO,data);
  // }

  // handleFetchComplete=()=>{
  //   ipcRenderer.on(this.channels.onFetchVideo,(_e, data: ISingleVideo)=>{
  //     console.log('fetch complete');
  //     this.setState({
  //       videoList:[...this.state.videoList,data]
  //     },()=>{
  //       if(this.state.currentDownloadIndex === -1){
  //         console.log('starting first downloading');
  //         console.log(this.state);
  //         this.downloadNextVideo();
  //       }
  //     })
  //     this.fetchIndex++;
  //     if(this.fetchIndex < this.props.downloadInfo.playList?.info.items.length!) this.fetchVideoInfo()
  //   })
  // }

  // handleFetchTimeLimitExit=()=>{
  //   var prevFetchIndex = this.fetchIndex;
  //   var interval = setInterval(()=>{
  //     if(this.fetchIndex >= this.props.downloadInfo.playList?.info.items.length! -1){
  //       clearInterval(interval);
  //       return;
  //     }
  //     if(prevFetchIndex === this.fetchIndex){
  //       console.log('time limit exit');
  //       this.fetchIndex++;
  //       this.fetchVideoInfo();
  //     }
  //     else prevFetchIndex=this.fetchIndex;
  //   },this.timeLimitForFetch)
  // }

  // downloadVideo=()=>{
  //   // console.log('fetchIndex:'+this.fetchIndex)
  //   console.log('downloadIndex:'+this.state.currentDownloadIndex);
  //   const data:IPlaylistVideo={
  //     playlistId:this.props.downloadInfo.id,
  //     video:this.state.videoList[this.state.currentDownloadIndex]
  //   }
  //   ipcRenderer.send(Renderer_Events.DOWNLOAD_PLALIST_VIDEO,data);
  // }

  // handleDownloadTimeLimitExit=()=>{
  //   var prevDownloadIndex = this.state.currentDownloadIndex;
  //   var interval = setInterval(()=>{
  //     if(this.state.currentDownloadIndex >= this.props.downloadInfo.playList?.info.items.length! -1){
  //       clearInterval(interval);
  //       return;
  //     }
  //     if(prevDownloadIndex === this.state.currentDownloadIndex){
  //       console.log('download time limit exit');
  //       this.downloadNextVideo();
  //     }
  //     else prevDownloadIndex=this.state.currentDownloadIndex;
  //   },this.timeLimitForDownload)
  // }

  // handleTimeLimitExit=()=>{
  //   this.handleFetchTimeLimitExit();
  //   this.handleDownloadTimeLimitExit();
  // }

  fetchPlaylistInfo=()=>{
    ipcRenderer.send(Renderer_Events.FETCH_PLAYLIST_INFO ,this.props.id);
  }

  handlePlaylistFetchComplete=()=>{
    ipcRenderer.on(Main_Events.HANDLE_PLAYLIST_FETCH_COMPLETE_+this.props.id,(_e, data: Result)=>{
      this.setState({info:data});
    })
  }

  componentDidMount(){
    this.fetchPlaylistInfo();
    // console.log(this.props.downloadInfo);
    // this.fetchVideoInfo();
    this.handlePlaylistFetchComplete();
    // this.handleFetchComplete();
    // this.handleTimeLimitExit();
  }
}

interface IPlaylistDownloadProps {
  // downloadInfo:IDownload;
  id:string;
}
