import { IDownload } from "../../lib";

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
