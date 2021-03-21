'use strict';

const gitOrigin = "https://tulshidas39.github.io";
const origin = window.location.origin.endsWith('/')?window.location.origin.slice(0,-1):window.location.origin;
const BaseUrl = origin === gitOrigin?gitOrigin+"/kr-youtube-downloader":origin;

const Urls={
    Home:BaseUrl,
    Download:BaseUrl+"/download"
}