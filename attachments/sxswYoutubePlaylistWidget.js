$(function(){
  // set up target dom
  var targetEl = $('#sxswYoutubePlaylistWidget');
  targetEl.append($('<div>').addClass('sidebar').append($('<ul>').attr('id','playlists')));
  targetEl.append($('<div>').addClass('viewer').html('<h1></h1').append($('<ul>').attr('id','playlist')));

  // if we're loaded from file: (e.g. Desktop on localhost), pull the data from the db host.
  // this way, we can fuck with html, css and js without constantly having to sync the files 
  // up to couchdb design doc.
  // if we're loaded from a couchdb, then host can be empty.
  var host = document.location.protocol == 'file:' ? "http://localhost:5984/youtube-sxsw/_design/by/" : "";
  var design = "_rewrite/api/_design/by";
  var view = host + design + '/_view/playlist_title';

  // grab the playlist data from couchdb and pass it to the success callback
  var playlistFetch = $.ajax({
    url: view,
    data: {include_docs:true},
    dataType: 'jsonp'
  });

  // iterate through the playlists, storing each one's subdata with its associated li element
  playlistFetch.success(function(response) {
      var row;
      for(var i in response.rows) {
        row = response.rows[i];
        var pl_li = $("<li>").attr('id', row.id).addClass('playlist');
        pl_li.data('doc', row.doc); // store playlist data for later rendering
        var pl_a  = $("<a>").attr('href', '#').attr('id', row.id).text(row.key);
        targetEl.find('#playlists').append(pl_li.html(pl_a));
      }
    }
  );

  // bind click event to each playlist name.
  // render list of videos.
  targetEl.find('#playlists li').live('click', function() {
    var doc = $(this).data('doc'); // fetch playlist subdata that was stored during playlistFetch
    targetEl.find('.viewer h1').text(doc.title);
    targetEl.find('#playlist li').remove();
    for(var i in doc.items) {
      var video = doc.items[i].video;
      var vid_li = $('<li>').attr('id',video.id).addClass('entry');
      vid_li.append($('<img>').addClass('thumbnail').attr('src',video.thumbnail.sqDefault));
      vid_li.append($('<a>').attr({href:video.content[5], target:'_blank'}).text(video.title));
      targetEl.find('#playlist').append(vid_li);
    }
  });
  
});
  