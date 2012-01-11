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
  , lists : {}
  , shows : {}
  }
  ;

ddoc.views.category = {
  map: function(doc) {
    if(doc.type == 'yt-video') {
      emit(doc.category, null);
    }
  },reduce:'_count'
}

ddoc.views.playlist_title = {
  map: function(doc) {
    if(doc.type == 'yt-playlist') {
      emit(doc.title, null);
    }
  }
}

ddoc.lists.html = function(head, req) {
  var row, doc;
  start({headers:{"Content-type":"text/html"}});
  while(row = getRow()) {
    doc = row.doc;
    send("<div class='entry'>");
    send("<h2><a href='"+doc.player.default+"' target='_blank'>"+doc.title+"</a></h2></div>");
    send("<p><img class='thumbnail hqDefault' src='"+doc.thumbnail.hqDefault+"'/></p>");
    send("<p class='description'>"+doc.description+"</p>");
    send("</div>");
  }
}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));
// ddoc.views.commentCount = {map: function(doc) {emit(doc.commentCount, null);}}
// ddoc.views.duration = {map: function(doc) {emit(doc.duration, null);}}
// ddoc.views.favoriteCount = {map: function(doc) {emit(doc.favoriteCount, null);}}
// ddoc.views.likeCount = {map: function(doc) {emit(doc.likeCount, null);}}
// ddoc.views.rating = {map: function(doc) {emit(doc.rating, null);}}
// ddoc.views.ratingCount = {map: function(doc) {emit(doc.ratingCount, null);}}
// ddoc.views.title = {map: function(doc) {emit(doc.title, null);}}
// ddoc.views.updated = {map: function(doc) {emit(doc.updated, null);}}
// ddoc.views.uploaded = {map: function(doc) {emit(doc.uploaded, null);}}
// ddoc.views.uploader = {map: function(doc) {emit(doc.uploader, null);},reduce:'_count'}
// ddoc.views.viewCount = {map: function(doc) {emit(doc.viewCount, null);}}
// ddoc.views.tag = {
//   map: function(doc) {
//     for(i in doc.tags) {
//       emit(doc.tags[i], null);
//     }
//   }, 
//   reduce: '_count'
// }
// 

module.exports = ddoc;