import { videoFormat } from "ytdl-core";

export interface IVideoFormat extends videoFormat{
    isContentLengthCalculated?:boolean;
}