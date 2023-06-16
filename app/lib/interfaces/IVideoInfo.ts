import { videoInfo } from "ytdl-core";
import { IVideoFormat } from "./IVideoFormat";

export interface IVideoInfo extends videoInfo{
    formats:IVideoFormat[];
}