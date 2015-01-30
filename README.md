# pleer
pleer.com api for nodejs

## Installation
  $ npm install pleer

## Use
```javascript
var pleer = require('pleer');
```
## Search Tracks
```javascript
pleer.search('coldplay magic', function(err, res) {
  console.log(res.tracks);
});
```

## Get Track URL
```javascript
//'12276558gSMj' = track_id
pleer.getUrl('12276558gSMj', function(err, res) {
  console.log(res.url);
});
```

## Get Track Info
```javascript
//'12276558gSMj' = track_id
pleer.getInfo('12276558gSMj', function(err, res) {
  console.log(res.data);
});
```

## Get Track Lyrics
```javascript
//'12276558gSMj' = track_id
pleer.getLyrics('12276558gSMj', function(err, res) {
  console.log(res.text);
});
```

## Get Top List
```javascript
pleer.getTopList(function(err, res) {
  console.log(res.tracks);
});
```

## Get Suggest
```javascript
pleer.getSuggest('coldplay', function(err, res) {
  console.log(res.suggest);
});
```
## *
This README.md is still being written. for more details visit http://pleer.com/api

## License
MIT
