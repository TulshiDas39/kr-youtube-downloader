import React from "react";
import { Container, Row, Col, Image, ProgressBar, } from "react-bootstrap";
import { IDownload, IProgress } from "../../../lib";
import { ISingleVideoState } from "../states";
import { ipcRenderer } from "electron";
import { Main_Events, Renderer_Events } from "../../../constants/constants";
import {FaFolderOpen} from "react-icons/fa"

export class SingleVideo extends React.PureComponent<ISingleVideoProps,ISingleVideoState>{
  readonly imgSrc = "https://cloudfour.com/examples/img-currentsrc/images/kitten-large.png";
  state:ISingleVideoState={
    progress:0
  }
  downloadedSize=0;
  readonly maxHeight='5rem';
  progressInterval?:any;
  readonly MB = 1024*1024;
  fileSize = parseInt(this.props.singleVideo.singleVideoInfo?.format.contentLength!);
  fileSizeMB = Math.round(this.fileSize / this.MB)

  render(){
    return(
      <Container className="border">
        <Row className="no-gutters overflow-hidden" style={{maxHeight:this.maxHeight}}>
          <Col xs={3} className="my-auto" style={{maxHeight:this.maxHeight}}>
            <Image src={this.props.singleVideo.singleVideoInfo?.info.videoDetails.thumbnail.thumbnails[0].url} rounded className="w-100" />
          </Col>
          <Col xs={6} style={{maxHeight:this.maxHeight}}>
            <div className="d-flex flex-column">
              <div className="h-100">
                <p className="smal">{this.props.singleVideo.singleVideoInfo?.info.videoDetails.title}</p>
              </div>
            </div>
          </Col>
          <Col xs={3} style={{maxHeight:this.maxHeight}}>
            <p className="mb-0">{( Math.round(this.downloadedSize/this.MB))}MB of {this.fileSizeMB} MB</p>
            {this.state.downloadComplete &&
              <div>
              <FaFolderOpen className="cursor-pointer h2" onClick={this.handleFolderClick} />
            </div>}
          </Col>
        </Row>
        {!!this.state.progress && !this.state.downloadComplete &&
          <div className="d-flex w-100">
            <ProgressBar className="w-100" animated variant="success" now={this.state.progress} key={1}  label={Math.round(this.state.progress )+"%"} />
          </div>}
      </Container>
    )
  }

  handleFolderClick=()=>{
    ipcRenderer.send(Renderer_Events.OPEN_FOLDER,this.props.singleVideo.singleVideoInfo?.downloadPath);
  }

  setProgress=()=>{
    const progresss =  this.downloadedSize/Number(this.props.singleVideo.singleVideoInfo?.format.contentLength!);
    this.setState({progress:progresss*100});
  }

  handleProgress=()=>{
    ipcRenderer.on(Main_Events.HANDLE_PROGRESS,(e,progress:IProgress)=>{
       if(this.props.playlistId === progress.playlistId && this.props.singleVideo.id === progress.singleVideoId){
         this.downloadedSize+=progress.chunkSize;
       };
    })
  }

  handleComplete=()=>{
    ipcRenderer.on(Main_Events.HANDLE_COMPLETE,(e,progress:IProgress)=>{
      if(this.props.singleVideo.id === progress.singleVideoId && this.props.playlistId === progress.playlistId) {
        clearInterval(this.progressInterval);
        this.setState({downloadComplete:true});
        this.props.onComplete(this.props.singleVideo.id);
      }
    })
  }

  handleException=()=>{
    var oldProgress = this.state.progress;
    if(!this.props.playlistId) return;
    let interval = setInterval(() => {
      if(this.state.progress === oldProgress){
        this.props.onComplete(this.props.singleVideo.id);
        clearInterval(interval);
      }
      else oldProgress = this.state.progress;
    }, 30000);
  }

  componentDidMount(){
    console.log('mounting');
    this.handleProgress();
    this.progressInterval = setInterval(this.setProgress,500);
    this.handleComplete();
    this.handleException();
  }

}

export interface ISingleVideoProps{
    singleVideo:IDownload;
    playlistId?:string;
    onComplete:(id:string)=>void;
}
