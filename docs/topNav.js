'use strict';

const e = React.createElement;

function TopNavComponent() {
    return (
      <React.Fragment>
        <div className="col-4">          
          <h4 className="text-white">Kr-youtube-downloader</h4>
        </div>
        <div className="col-2">
          <span>Docs</span>
        </div>
      </React.Fragment>
    );  
}

const TopNav = React.memo(TopNavComponent);

const domContainer = document.querySelector('#topNav');
ReactDOM.render(e(TopNav), domContainer);