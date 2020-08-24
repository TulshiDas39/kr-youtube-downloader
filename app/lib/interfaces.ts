import { videoInfo, videoFormat } from "ytdl-core";
import { IStore } from "../store";
import { result } from "ytpl";

export interface IDownload{
  id:string;
  singleVideoInfo?:ISingleVideo;
  playList?:{
    fetched:ISingleVideo[];
    info:result;
    downloadPath:string;
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

export interface IFetch{
  videoId:string,
  channel:string,
  playlistPath?:string,
}

export interface IPlaylistVideo{
  video:ISingleVideo,
  playlistId:string,
}
