'use strict';

const e = React.createElement;

function DownloadComponent() {
    return (
      <div className="row g-0">
          <h6>Download</h6>
      </div>
    );  
}

const Download = React.memo(DownloadComponent);

const domContainer = document.querySelector('#download');
ReactDOM.render(e(Download), domContainer);