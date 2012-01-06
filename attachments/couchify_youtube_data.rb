require 'rubygems'
require 'couchrest'
require 'json'

@couch = CouchRest.database('youtube-sxsw')

@feedurl = "https://gdata.youtube.com/feeds/api/videos"

@params = {
  'author' => 'sxsw',
  'v' => 2,
  'alt' => 'jsonc',
  'start-index' => 1, # this will iterate upto 1000(- max-results) only. guess it's a youtube public api limitation
  'max-results' => 50 # maximum allowed
}

def fetch_results
  JSON.parse(RestClient.get(@feedurl, {:params => @params}))
end

while results = fetch_results
  puts "fetching #{@params['max-results']} starting at #{@params['start-index']}"
  items = results['data']['items']
  # some youtube ids start with _, which is a no-no for couch
  # lets append 'video-' to the id.
  items.collect!{|item| item['_id'] = 'video-'+item['id']; item}
  @couch.bulk_save(items)
  @params['start-index'] = @params['start-index'].to_i + @params['max-results'].to_i
end
