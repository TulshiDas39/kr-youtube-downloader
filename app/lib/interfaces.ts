import { videoInfo, videoFormat } from "ytdl-core";
import { IStore } from "../store";

export interface IDownload{
  id:string;
  singleVideoInfo?:ISingleVideo;
  videoList?:{
    list:ISingleVideo[];
  };
  inProgress?:boolean;
}
export interface ISingleVideo{
  info:videoInfo;
  format:videoFormat;
  downloadPath:string;
}

export interface IProgress{
  singleVideoId:string;
  playlistId?:string;
  chunkSize:number;
}

export type IReduxState = ReturnType<IStore['getState']>
