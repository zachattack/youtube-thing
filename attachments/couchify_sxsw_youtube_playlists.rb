require 'rubygems'
require 'couchrest'
require 'json'

@couch = CouchRest.database!('youtube-sxsw')

# first, let's get the list of playlists. then, we'll fetch each playlist
@feedurl = "https://gdata.youtube.com/feeds/api/users/sxsw/playlists"

puts "attempting to fetch playlist list"
result = JSON.parse(RestClient.get(@feedurl, {:params => {'v'=>2, 'alt'=>'jsonc'}}))
result['data']['items'].each do |playlist_item|
  playlist_id = playlist_item['id']
  print "...attempting to fetch playlist #{playlist_id} "
  pl_feed_url = "https://gdata.youtube.com/feeds/api/playlists/#{playlist_id}"
  print "#{pl_feed_url}\n"
  playlist_result = JSON.parse(RestClient.get(pl_feed_url, {:params => {'v'=>2, 'alt'=>'jsonc'}}))
  playlist_data = playlist_result['data']
  playlist_data['_id'] = "yt-playlist-#{playlist_data['id']}"
  playlist_data['type'] = "yt-playlist"
  @couch.save_doc(playlist_data)
  puts "saved #{playlist_data['_id']}"
end
