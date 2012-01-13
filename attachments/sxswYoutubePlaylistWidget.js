$(function(){
	var host = document.location.protocol == 'file:' ? "http://localhost:5984/youtube-sxsw/_design/by/" : "";
  var design = "_rewrite/api/_design/by";
  var view = host + design + '/_view/playlist_title';
	console.log(view);
  var playlistFetch = $.ajax({
    url: view,
		data: {include_docs:true},
    dataType: 'jsonp'
  });
	playlistFetch.success(function(response) {
	    var row;
	    for(var i in response.rows) {
	      row = response.rows[i];
	      var pl_li = $("<li>").attr('id', row.id).addClass('playlist');
	      pl_li.data('doc', row.doc); // todo: do something with this
	      var pl_a  = $("<a>").attr('href', '#').attr('id', row.id).text(row.key);
	      $('#playlists').append(pl_li.html(pl_a));
	    }
	  }
	);
});
  
$('#playlists li').live('click', function() {
  var doc = $(this).data('doc');
  $('#main h1').text(doc.title);
  $('#playlist li').remove();
  for(var i in doc.items) {
    var video = doc.items[i].video;
    // console.log(video);
    $('#playlist').append($('#entryTemplate').render({
      title: video.title,
      thumbnail: video.thumbnail.sqDefault,
      href: video.content[5]
    }));
  }
});
