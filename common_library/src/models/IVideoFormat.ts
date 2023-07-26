
export interface IVideoFormat {
    hasVideo: boolean;
    hasAudio: boolean;
    contentLength: string;
    isContentLengthCalculated?:boolean;
    itag:number;
    container:string;
    qualityLabel:string;
    mimeType:string;
}