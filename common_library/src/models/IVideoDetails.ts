export interface IVideoDetails{
    title:string;
    lengthSeconds:string;
    thumbnails:IThumbnail[];
    videoId:string;
}

interface IThumbnail{
    url:string;
}