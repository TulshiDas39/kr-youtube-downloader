import React from "react";
import { IDownloadListState } from "../states";
import { PlaylistDownload } from "./PlaylistDownload";
import { ipcRenderer } from "electron";
import { Main_Events } from "../../../constants/constants";
import {IDownload, ISingleVideo} from "../../../lib"
import { SingleVideo } from "./SingleVideo";
import { MyModal } from "../../../lib/Modal";
import { Helper } from "../../../lib/helpers";
import { connect, ConnectedProps } from "react-redux";
import { ActionModal } from "../../common/Modals";
import { ActionHome } from "../slice";
import ytpl,{result} from "ytpl";

class DownloadListComponent extends React.PureComponent<DownloadListProps,IDownloadListState>{
  state:IDownloadListState={
    downloads:[]
  }
  render(){
    return (
      <div>
        <MyModal
        show={!!this.state.newItemExist}
        onClose={this.handleModalClose}
        bodyText="Video already in download list"
        />
        {
          this.state.downloads.map(download=>{
            if(download.singleVideoInfo) return (
              <SingleVideo key={download.id} singleVideo={download} onComplete={this.handleComplete} />
            )
            return <PlaylistDownload key={download.id} downloadInfo={download} />
          })
        }
      </div>
    )
  }

  handleComplete=(id:string)=>{
    const downloadIndex = this.state.downloads.findIndex(x=>x.id === id);
    const completedItem:IDownload = {
      ...this.state.downloads[downloadIndex],
      inProgress:false
    }
    this.setState({
      downloads:[
        ...this.state.downloads.slice(0,downloadIndex),completedItem,
        ...this.state.downloads.slice(downloadIndex+1)
      ]
    })
  }

  handleModalClose=()=>{
    this.setState({newItemExist:false});
  }

  existInList=(download:IDownload)=>{
    return this.state.downloads.some(x=>x.id === download.id);
  }

  setIpcEvents=()=>{
    this.handleNewDownload();
    this.handleNewPlaylistDownload();
  }

  itemExist=(id:string)=>{
    return this.state.downloads.some(x=>x.id === id);
  }
  removeItemIfExist=(id:string)=>{
    if(this.itemInProgress(id)) {
      this.props.dispatch(ActionModal.showAlertModal({
        msg:'Already downloading'
      }))
      return false;
    }
    else this.setState({
      downloads:this.state.downloads.filter(d=>d.id !== id)
    })
    return true
  }
  itemInProgress=(id:string)=>{
    console.log(this.state.downloads);
    let item = this.state.downloads.find(x=>x.id === id);
    return !!item?.inProgress;
  }

  handleNewPlaylistDownload=()=>{
    ipcRenderer.on(Main_Events.ADD_PLAYLIST_DOWNLOAD_ITEM,(e,item: IDownload)=>{
      console.log(item);
      this.props.dispatch(ActionHome.removeFromFetch(item.id));
      this.setState({downloads:this.state.downloads.concat(item)});
    })
  }

  handleNewDownload=()=>{
    ipcRenderer.on(Main_Events.ADD_SINGLE_DOWNLOAD_ITEM,(e,item:ISingleVideo)=>{
       this.props.dispatch(ActionHome.removeFromFetch(item.info.videoDetails.videoId));
       const downloadItem:IDownload={
         id:item.info.videoDetails.videoId,
         singleVideoInfo:item,
         inProgress:true
       }
       this.setState({downloads:this.state.downloads.concat(downloadItem)});
    })
  }

  componentDidMount(){
    this.setIpcEvents();
    Helper.downloadExist = this.itemExist;
    Helper.downloadInProgress = this.itemInProgress;
    Helper.removeItemIfExist = this.removeItemIfExist;
  }
}

interface DownloadListProps extends ConnectedProps<typeof connector>{

}
const connector = connect();
export const DownloadList = connector(DownloadListComponent);
