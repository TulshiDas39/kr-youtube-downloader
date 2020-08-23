import { IDownload, ISingleVideo } from "../../lib";
import { videoInfo } from "ytdl-core";

export interface IHomeState {
  url:string
};

export interface IDownloadListState{
  downloads:IDownload[];
  newItemExist?:boolean;
}

export interface ISingleVideoState{
  progress:number;
  downloadComplete?:boolean;
}

export interface IHomeReducerState{
  inFetch:string[];
}

export interface IPlaylistDownloadState{
  currentDownloadIndex:number;
  videoList:ISingleVideo[],
}
