$(function(){
  // set up target dom
  var targetEl = $('#sxswYoutubePlaylistWidget');
  targetEl.append($('<div>').attr({id:'viewer'}).
    append($('<iframe>')));
  targetEl.append($('<div>').addClass('playlists').
    append($('<ul>').attr('id','playlists')));
  targetEl.append($('<div>').addClass('playlist').
    html('<h1></h1>').
    append($('<ul>').attr('id','playlist')));
  
  var videoInfo = $('<div>').attr({id:'videoInfo'});
  videoInfo.append('<h1>');
  videoInfo.append($('<p>').addClass('description'));
  targetEl.find('#viewer').append(videoInfo);
  
  // if we're loaded from file: (e.g. Desktop on localhost), pull the data from the db host.
  // this way, we can fuck with html, css and js without constantly having to sync the files 
  // up to couchdb design doc.
  // if we're loaded from a couchdb, then host can be empty.
  var host = document.location.protocol == 'file:' ? "http://localhost:5984/youtube-sxsw/_design/by/" : "";
  var design = "_rewrite/api/_design/by";
  var view = host + design + '/_view/playlist_id';

  var couchViewParams = {
    include_docs: true,
    key: '"'+targetEl.attr('data-ytid')+'"'
  }
  // grab the playlist data from couchdb and pass it to the success callback
  var playlistFetch = $.ajax({
    url: view,
    data: couchViewParams,
    dataType: 'jsonp'
  });

  // iterate through the playlists, storing each one's subdata with its associated li element
  playlistFetch.success(function(response) {
    var row;
    for(var i in response.rows) {
      row = response.rows[i];
      var pl_li = $("<li>").attr('id', row.id).addClass('playlist');
      pl_li.data('doc', row.doc); // store playlist data for later rendering
      var pl_a  = $("<a>").attr('href', '#').attr('id', row.id).text(row.value.title);
      targetEl.find('#playlists').append(pl_li.html(pl_a));
    }
    // go ahead and click the playlist link to display the playlist
    targetEl.find('#playlists li').click();
  });

  // bind click event to each playlist name.
  // render list of videos.
  targetEl.find('#playlists li').live('click', function() {
    var doc = $(this).data('doc'); // fetch playlist subdata that was stored during playlistFetch
    targetEl.find('.playlist h1').text(doc.title);
    targetEl.find('#playlist li').remove();
    for(var i in doc.items) {
      var video = doc.items[i].video;
      var vid_li = $('<li>').attr('id',video.id).addClass('entry');
      vid_li.data('video', video);
      vid_li.append($('<img>').
        addClass('thumbnail').
        attr('src',video.thumbnail.sqDefault));
      vid_li.append($('<a>').
        attr({href:video.id}).
        addClass('videolink').text(video.title));
      targetEl.find('#playlist').append(vid_li);
    }
  });
  
  targetEl.find('#playlist li').live('click', function(){
    var video = $(this).data('video');
	$(this).addClass('active').siblings().removeClass('active');
    console.log(video)
    var videosrc = "http://www.youtube.com/v/"+video.id+"?version=3";
    videosrc = videosrc + "&enablejsapi=1&autoplay=1";
    videosrc = videosrc + "&origin=" + document.location.host;
    console.log(videosrc)
    targetEl.find('#viewer iframe').attr({src: videosrc})
    var videoInfo = targetEl.find('#videoInfo');
    videoInfo.find('h1').text(video.title);
    videoInfo.find('p.description').text(video.description);
    return false;
  });
  
});
  