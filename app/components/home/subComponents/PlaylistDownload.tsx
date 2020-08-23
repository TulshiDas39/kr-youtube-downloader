import React from "react";
import { IDownload, IFetch, ISingleVideo } from "../../../lib";
import { Container, Row, Col } from "react-bootstrap";
import { IPlaylistDownloadState } from "../states";
import { FaFolderOpen } from "react-icons/fa";
import { ipcRenderer } from "electron";
import { Renderer_Events, Main_Events } from "../../../constants/constants";
import { SingleVideo } from "./SingleVideo";

export class PlaylistDownload extends React.PureComponent<IPlaylistDownloadProps,IPlaylistDownloadState>{
  readonly maxHeight='5rem';
  state:IPlaylistDownloadState={
    currentDownloadIndex:0,
    videoList:[],
  }
  readonly channels = {
    onFetchVideo: Main_Events.ON_SINGLE_VIDEO_INFO_FETCH_COMPLETE+this.props.downloadInfo.id
  }
  fetchIndex = 0;

  render(){
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
                  <p className="smal">{this.props.downloadInfo.playList?.info.title}</p>
                </div>
              </div>
            </Col>
            <Col xs={3} style={{maxHeight:this.maxHeight}}>
              <p className="mb-0">{this.state.currentDownloadIndex+1} of {this.props.downloadInfo.playList?.info.total_items}</p>
              {this.state.currentDownloadIndex === -1 &&
                <div>
                <FaFolderOpen className="cursor-pointer h2" onClick={this.handleFolderClick} />
              </div>}
            </Col>
          </Row>
          <div className="row">
                {
                  this.state.videoList.map(v=>(
                    <SingleVideo onComplete={()=>{}} singleVideo={{
                      id:v.info.videoDetails.videoId,
                      singleVideoInfo:v,
                    }} playlistId={this.props.downloadInfo.id} />
                  ))
                }
          </div>
        </Container>
      </div>
    )
  }
  handleFolderClick=()=>{
    ipcRenderer.send(Renderer_Events.OPEN_FOLDER,this.props.downloadInfo.playList?.downloadPath!);
  }

  fetchVideoInfo=(videoId:string)=>{
    const data:IFetch={
      channel:Main_Events.ON_SINGLE_VIDEO_INFO_FETCH_COMPLETE+this.props.downloadInfo.id,
      videoId:videoId,
      playlistPath:this.props.downloadInfo.playList?.downloadPath
    }
    ipcRenderer.send(Renderer_Events.FETCH_SINGLE_VIDEO_INFO,data);
  }
  handleFetchComplete=()=>{
    ipcRenderer.on(this.channels.onFetchVideo,(e, data: ISingleVideo)=>{
      this.setState({
        videoList:[...this.state.videoList,data]
      })
      this.fetchIndex++;
      this.fetchVideoInfo(this.props.downloadInfo.playList?.info.items[this.fetchIndex].id!)
    })
  }
  componentDidMount(){
    this.fetchVideoInfo(this.props.downloadInfo.playList?.info.items[0].id!);
    this.handleFetchComplete();
  }
}

interface IPlaylistDownloadProps {
  downloadInfo:IDownload;
}
