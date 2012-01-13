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

ddoc.views.playlist_id = {
  map: function(doc) {
    if(doc.type == 'yt-playlist') {
      emit(doc._id, {"title":doc.title});
    }
  }
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));
module.exports = ddoc;