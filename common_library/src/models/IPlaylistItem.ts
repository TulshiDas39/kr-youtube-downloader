export interface IPlaylistItem{
    id:string;
    title:string;
    thumbnails:IThumbnail[];
}

interface IThumbnail{
    url:string;
}