var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/by'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  , views : {}
  }
  ;

ddoc.views.playlist_title = {
  map: function(doc) {
    if(doc.type == 'yt-playlist') {
      emit(doc.title, null);
    }
  }
}
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));
module.exports = ddoc;