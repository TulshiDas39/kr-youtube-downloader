import { videoInfo, videoFormat } from "ytdl-core";
import { IStore } from "../../store";
import { Result } from "ytpl";

export interface IDownload{
  id:string;
  singleVideoInfo?:ISingleVideo;
  playList?:{
    fetched:ISingleVideo[];
    info:Result;
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

export interface ISingleVideoDownloadFromInfo{
  info:videoInfo;
  selectedVideoFormat:videoFormat;
  playlistId?:string;
  downloadPath?:string;  
}

export interface ISingleVideoDownloadStarted{
  downloadPath:string;
}

export interface IPlaylistFetchComplete{
  result: Result;
  downloadPath:string;
}