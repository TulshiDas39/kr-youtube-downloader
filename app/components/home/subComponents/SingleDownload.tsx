import React from "react";
import { IDownload } from "../../../common";

export class SingleDownload extends React.PureComponent<ISingleDownloadProps>{
  render(){
    return (
      <div>
        <p>single download</p>
      </div>
    )
  }
}

export interface ISingleDownloadProps{
  videoInfo:IDownload;
}
