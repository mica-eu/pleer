var request = require('request'),
  accessToken,
  tokenExpireTime;

function isValidToken(done) {
  if (!tokenExpireTime || tokenExpireTime < (new Date()).getTime())
    tokenRequest(done);
  else
    done(null);
} // isValidToken

function tokenRequest(done) {
  var config = {
    method: 'POST',
    body: 'grant_type=client_credentials',
    uri: 'http://api.pleer.com/token.php',
    headers: {
      'Accept': '*/*',
      'Cache-Control': 'no-cache',
      'Authorization': 'Basic Og==',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  };

  request(config, function(err, res, body) {
    if (err)
      return done(err);

    if (res.statusCode !== 200)
      return done(new Error('Error in token request.'));

    var result = JSON.parse(body);
    if (!result)
      return done(new Error('Token parsing error.'));

    accessToken = result.access_token;
    tokenExpireTime = (new Date()).getTime() + 3600000;
    done(null);
  });
} // tokenRequest

function search(terms, opt, done) {
  isValidToken(function(err) {
    if (!terms)
      throw new Error('[terms] is a parameter obrigatory.');

    if (!opt && !done)
      throw new Error('[done] is a parameter obrigatory.');

    if (!done)
      done = opt;

    if (err)
      return done(err);

    var options = {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      uri: 'http://api.pleer.com/index.php'
    };

    var limit = opt.limit || 20;
    var quality = opt.quality || 'all'; //all, bad, good, best
    var page = opt.page || 1;

    options.body = 'access_token=' + encodeURIComponent(accessToken) +
    '&method=tracks_search' +
    '&result_on_page=' + limit +
    '&quality=' + encodeURIComponent(quality) +
    '&page=' + page +
    '&query=' + encodeURIComponent(terms);

    request(options, function(err, res, body) {
      var tracks = [];

      if (err)
        return done(err);

      if (res.statusCode !== 200)
        return done(new Error('Error in search track.'));

      var result = JSON.parse(body);
      if (!result) return done(new Error('Tracks parsing error.'));

      if (result.sucess === false)
        return done(null, {
          success: result.success,
          message: result.message
        });

      for (var i in result.tracks) {
        tracks.push({
          track_id: result.tracks[i].id,
          artist: result.tracks[i].artist,
          track: result.tracks[i].track,
          length: result.tracks[i].lenght,//lenght?
          text_id: result.tracks[i].text_id,
          bitrate: result.tracks[i].bitrate
        });
      }

      done(null, {
        sucess: result.success,
        count: result.count,
        tracks: tracks
      });
    });
  });
} // search

function getUrl(trackId, opt, done) {
  isValidToken(function(err) {
    if (!trackId)
      throw new Error('[trackId] is a parameter obrigatory.');

    if (!opt && !done)
      throw new Error('[done] is a parameter obrigatory.');

    if (!done)
      done = opt;

    if (err)
      return done(err);

    var options = {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      uri: 'http://api.pleer.com/index.php'
    };

    var reason = typeof opt === 'string' ? opt : 'listen';

    options.body = 'access_token=' + encodeURIComponent(accessToken) +
    '&method=tracks_get_download_link' +
    '&reason=' + encodeURIComponent(reason) +
    '&track_id=' + encodeURIComponent(trackId);

    request(options, function (err, res, body) {
      if (err)
        return done(err);

      if (res.statusCode !== 200)
        return done(new Error('Error in get track url.'));

      var result = JSON.parse(body);
      if (!result)
        return done(new Error('Url parsing error.'));

      if (result.sucess === false)
        return done(null, {
          success: result.success,
          message: result.message
        });

      done(null, result);
    });
  });
} // getUrl

function getInfo(trackId, done) {
  isValidToken(function(err) {
    if (!trackId)
      throw new Error('[trackId] is a parameter obrigatory.');

    if (!done)
      throw new Error('[done] is a parameter obrigatory.');

    if (err)
      return done(err);

    var options = {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      uri: 'http://api.pleer.com/index.php'
    };

    options.body = 'access_token=' + encodeURIComponent(accessToken) +
    '&method=tracks_get_info' +
    '&track_id=' + encodeURIComponent(trackId);

    request(options, function (err, res, body) {
      if (err)
        return done(err);

      if (res.statusCode !== 200)
        return done(new Error('Error in get track info.'));

      var result = JSON.parse(body);
      if (!result)
        return done(new Error('Info parsing error.'));

      if (result.sucess === false)
        return done(null, {
          success: result.success,
          message: result.message
        });

      var track = {
        track_id: result.data.track_id,
        artist: result.data.artist,
        track: result.data.track,
        length: result.data.lenght,
        bitrate: result.data.bitrate,
        size: result.data.size
      };

      done(null, {
        success: result.success,
        data: track
      });
    });
  });
} // getInfo


module.exports = {
  search: search,
  getUrl: getUrl,
  getInfo: getInfo
};
