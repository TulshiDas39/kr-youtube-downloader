import { IDownload } from "../../common";

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
