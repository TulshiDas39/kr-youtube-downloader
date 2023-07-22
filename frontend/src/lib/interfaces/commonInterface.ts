import { videoFormat, videoInfo } from "ytdl-core";
import { IVideoInfo } from "./IVideoInfo";
import { IVideoFormat } from "./IVideoFormat";

export interface IProgress{
    singleVideoId:string;
    chunkSize:number;
}

export interface ISingleVideoDownloadStarted{
    downloadPath:string;
}

export interface ISingleVideoDownloadFromInfo{
    info:IVideoInfo;
    selectedVideoFormat:IVideoFormat;
    playlistId?:string;
    downloadPath?:string;  
}