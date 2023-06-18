'use strict';

const e = React.createElement;

function TopNavComponent() {
  const url = window.location.href;
  console.log('path',url);
    return (
      <React.Fragment>
        <div className="col-4">          
          <span className="text-white h4 m-0">
            <a href={BaseUrl} className="text-white text-decoration-none">Kr-youtube-downloader</a>
          </span>
        </div>
        <div className="col-4">
          <span>Docs</span>
        </div>
        <div className={`col-4 nav-item-download ${(url === Urls.Download || url === Urls.Download+".html")?'active':''}`}>
          <a href="./download.html" className="text-white text-decoration-none"><span>Download</span></a> 
        </div>
      </React.Fragment>
    );  
}

const TopNav = React.memo(TopNavComponent);

const domContainer = document.querySelector('#topNav');
ReactDOM.render(e(TopNav), domContainer);