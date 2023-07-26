export interface IVideoDetails{
    title:string;
    lengthSeconds:string;
    thumbnails:IThumbnail[];
}

interface IThumbnail{
    url:string;
}