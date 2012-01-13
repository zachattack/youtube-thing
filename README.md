Youtube Playlist Widget Thingy
==============================
Requirements
------------
* Ruby (to poll the Youtube API)
* couchrest rubygem (to store the data in...)
* CouchDB
* nodejs (because we need...)
* npm (node package manager, so we can install...)
* couchapp (npm install -g couchapp. for uploading design doc to the couchdb)

Install
-------
Once you get all that shit installed, and CouchDB running locally...
Pull in the Youtube playlist data:
<pre><code>ruby attachments/couchify_sxsw_youtube_playlists.rb</code></pre>
Then upload the app to couchdb:
<pre><code>couchapp push app.js http://localhost:5984/youtube-sxsw</code></pre>
Make sure your CouchDB is configured to allow JSONP (cross-origin) requests:
<pre><code>allow_jsonp: true</code></pre>

Then visit

http://localhost:5984/youtube-sxsw/_design/by/_rewrite/

Or, you should be able to just <code>open attachments/index.html</code> and things should work.

When loaded in the latter manner, you should be able to edit the html, css and js files and see the results by simply reloading. In order to push your changes up to the couchdb app, you'll need to re-run the couchapp command.