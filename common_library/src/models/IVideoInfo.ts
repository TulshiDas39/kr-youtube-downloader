import { IVideoDetails } from "./IVideoDetails";
import { IVideoFormat } from "./IVideoFormat";

export interface IVideoInfo{
    videoDetails: IVideoDetails;
    formats:IVideoFormat[];
}