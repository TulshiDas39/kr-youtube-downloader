import { videoInfo } from "ytdl-core";
import { IVideoFormat } from "./IVideoFormat";

export interface IVideoInfo{
    videoDetails: any;
    formats:IVideoFormat[];
}