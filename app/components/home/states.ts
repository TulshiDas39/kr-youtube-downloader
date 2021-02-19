import { IDownload, ISingleVideo } from "../../lib";
import { Result } from "ytpl";

export interface IHomeState {
  url:string
};

export interface IDownloadListState{
  downloads:IDownload[];
  newItemExist?:boolean;
}

export interface IHomeReducerState{
  inFetch:string[];
  downloadIds:string[];
}

export interface IPlaylistDownloadState{
  currentDownloadIndex:number;
  videoList:ISingleVideo[],
  expanded:boolean,
  info?:Result
}
