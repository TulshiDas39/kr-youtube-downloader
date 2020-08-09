import { videoInfo, videoFormat } from "ytdl-core";

export interface IDownload{
  id:string;
  singleVideoInfo?:ISingleVideo;
  videoList?:any;
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
