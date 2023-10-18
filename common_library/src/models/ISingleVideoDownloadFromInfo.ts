import { IVideoFormat } from ".";
import { IVideoInfo } from "./IVideoInfo";

export interface ISingleVideoDownloadFromInfo{
    info:IVideoInfo;
    selectedVideoFormat:IVideoFormat;
    playlistId?:string;
    downloadPath?:string;  
}