import React from "react";
import { IDownloadListState } from "../states";
import { PlaylistDownload } from "./PlaylistDownload";
import { ipcRenderer } from "electron";
import { Main_Events } from "../../../constants/constants";
import {IDownload, ISingleVideo} from "../../../common"
import { SingleVideo } from "./SingleVideo";
import { MyModal } from "../../../common/Modal";
import { Helper } from "../../../common/helpers";

export class DownloadList extends React.PureComponent<{},IDownloadListState>{
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
              <SingleVideo key={download.id} singleVideo={download} />
            )
            return <PlaylistDownload key={download.id} />
          })
        }
      </div>
    )
  }

  handleModalClose=()=>{
    this.setState({newItemExist:false});
  }

  existInList=(download:IDownload)=>{
    return this.state.downloads.some(x=>x.id === download.id);
  }

  setIpcEvents=()=>{
    this.handleNewDownload();
  }

  itemExist=(id:string)=>{
    return this.state.downloads.some(x=>x.id === id);
  }

  handleNewDownload=()=>{
    ipcRenderer.on(Main_Events.ADD_SINGLE_DOWNLOAD_ITEM,(e,item:ISingleVideo)=>{
      console.log(item);
       const downloadItem:IDownload={
         id:item.info.videoDetails.videoId,
         singleVideoInfo:item
       }
       if(!this.existInList(downloadItem)) this.setState({downloads:this.state.downloads.concat(downloadItem)});
       else this.setState({newItemExist:true});
    })
  }

  componentDidMount(){
    this.setIpcEvents();
    Helper.downloadExist = this.itemExist;
  }
}
