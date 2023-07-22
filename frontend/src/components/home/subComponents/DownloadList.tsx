import React from "react";
import { SingleVideo } from "./SingleVideo";
import { useSelectorTyped } from "../../../store/rootReducer";
import { PlaylistDownload } from "./PlaylistDownload";
import { IpcUtils } from "../../../lib";


function DownloadListComponent(){
  const {downloadIds} = useSelectorTyped(state=>({
    downloadIds:state.home.downloadIds
  }))
    return (
      <div>
        {
          downloadIds.map(id=>{
            if(IpcUtils.isValidVideoId(id)) return (
              <SingleVideo key={id} id={id}  />
            )
            return <PlaylistDownload key={id} id={id} />
          })
        }
      </div>
    )
  
}

export const DownloadList = React.memo(DownloadListComponent);