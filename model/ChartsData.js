var method = ChartsData.prototype;

function ChartsData(_mediaType, _dates, _countsLikes, _countComments, _countViews) {
    this.mediaType = _mediaType;
    this.dates = _dates;
    this.countsLikes = _countsLikes;
    this.countComments = _countComments;
    this.countViews = _countViews;
}

method.setmediaType  = function(_code) {
  this.mediaType = _code;
}
method.getmediaType = function() {
  return this.mediaType;
}

method.setdates  = function(_code) {
  this.dates = _code;
}
method.getdates = function() {
  return this.dates;
}

method.setcountsLikes  = function(_code) {
  this.countsLikes = _code;
}
method.getcountsLikes = function() {
  return this.countsLikes;
}

method.setcountComments  = function(_code) {
  this.countComments = _code;
}
method.getcountComments = function() {
  return this.countComments;
}

method.setcountViews  = function(_code) {
  this.countViews = _code;
}
method.getcountViews = function() {
  return this.countViews;
}

module.exports = ChartsData;
