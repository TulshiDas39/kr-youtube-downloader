'use strict';

const e = React.createElement;

function HomeComponent() {
    return (
      <div className="col-12">
        <h6>An Youtube video and playlist downloader application</h6>
        <h3>Features</h3>
        <ul>
          <li>Youtube video download</li>
          <li>Youtube playlist download</li>
          <li>Download video in audio format or different format and qulity</li>
          <li>Download Selected videos from playlist</li>
          <li>Download parallelly playlist videos</li>
        </ul>
      </div>
    );  
}

const Home = React.memo(HomeComponent);

const domContainer = document.querySelector('#home');
ReactDOM.render(e(Home), domContainer);