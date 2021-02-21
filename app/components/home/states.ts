import { IDownload } from "../../lib";
import { Item, Result } from "ytpl";

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
  expanded:boolean,
  info?:Result,
  donloadPath:string,
  isDownloading:boolean,
  fetchingItem?:Item,
  downloadingItem?:Item,
  downloadCompletedCount:number;
}
