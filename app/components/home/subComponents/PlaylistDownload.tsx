import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { IPlaylistDownloadState } from "../states";
import { FaAngleDown, FaAngleUp, FaSortAmountDown } from "react-icons/fa";
import { ipcRenderer } from "electron";
import { Renderer_Events, Main_Events } from "../../../constants/constants";
import { SingleVideo } from "./SingleVideo";
import { IPlaylistFetchComplete } from "../../../lib";
import { Item } from "ytpl";

export class PlaylistDownload extends React.PureComponent<IPlaylistDownloadProps,IPlaylistDownloadState>{
  readonly maxHeight='5rem';
  state:IPlaylistDownloadState={
    expanded:true,
    isDownloading:false,
    donloadPath:"",
    completedIds:[],
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
                  <p className="mb-0">{this.state.completedIds.length} of {this.state.info.items.length}</p>
                  {!this.state.isDownloading &&
                  <Button className="ml-1" type="button" title="Start download" onClick={this.startDownload}><FaSortAmountDown /></Button>}
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
                    <SingleVideo key={v.id} onComplete={()=>this.handleSingleVideoDownloadComplete(v)} id={v.id} playlistId={this.props.id}
                       info={v} startDownload={this.state.downloadingItem?.id === v.id} startFetch={this.state.fetchingItem?.id === v.id}
                       downloadPath={this.state.donloadPath} onFetchComplete={this.fetchNextVideo} />
                  ))
                }
          </div>
        </Container>
      </div>
    )
  }
  handleSingleVideoDownloadComplete=(item:Item)=>{
    if(!this.state.completedIds.includes(item.id)) {
      this.setState({completedIds:[...this.state.completedIds,item.id]});
    }
    this.downloadNextVideo();
  }
  startDownload=()=>{
    this.downloadNextVideo();
    this.setState({isDownloading:true});
  }
  handleExpansion=()=>{
    this.setState({expanded:!this.state.expanded});
  }
  fetchNextVideo=()=>{
    if(!this.state.info) return;
    let fetchingIndex = this.state.info.items.findIndex(x=>x.id === this.state.fetchingItem?.id);
    fetchingIndex++;
    this.setState({fetchingItem:this.state.info.items[fetchingIndex]});
  }
  downloadNextVideo=()=>{
    if(!this.state.info) return;
    let downloadingIndex = this.state.info.items.findIndex(x=>x.id === this.state.downloadingItem?.id);
    downloadingIndex++;
    this.setState({downloadingItem:this.state.info.items[downloadingIndex]});    
  }

  fetchPlaylistInfo=()=>{
    ipcRenderer.send(Renderer_Events.FETCH_PLAYLIST_INFO ,this.props.id);
  }

  handlePlaylistFetchComplete=()=>{
    ipcRenderer.on(Main_Events.HANDLE_PLAYLIST_FETCH_COMPLETE_+this.props.id,(_e, data: IPlaylistFetchComplete)=>{      
      this.setState({info:data.result,donloadPath:data.downloadPath});
      this.setState({fetchingItem:data.result.items[0]});
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
