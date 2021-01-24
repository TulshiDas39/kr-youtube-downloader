import React from "react";
import { PlaylistDownload } from "./PlaylistDownload";
import { SingleVideo } from "./SingleVideo";
import { useSelectorTyped } from "../../../store";
import ytdl from "ytdl-core";


function DownloadListComponent(){
  const {downloadIds} = useSelectorTyped(state=>({
    downloadIds:state.home.downloadIds
  }))
    return (
      <div>
        {
          downloadIds.map(id=>{
            if(ytdl.validateID(id)) return (
              <SingleVideo key={id} id={id} />
            )
            return <PlaylistDownload key={id} id={id} />
          })
        }
      </div>
    )
  
}

export const DownloadList = React.memo(DownloadListComponent);