var method = Post.prototype;

function Post(_mediaType, _countsLikes, _countComments, _countViews, _takenAt,
              _text) {
    this.mediaType = _mediaType;
    this.countsLikes = _countsLikes;
    this.countComments = _countComments;
    this.countViews = _countViews;
    this.takenAt = _takenAt;
    this.text = _text;
}

method.setduration  = function(_duration ) {
  this.duration = _duration;
}
method.getduration  = function() {
  return this.duration ;
}

method.setvideos  = function(_videos ) {
  this.videos = _videos;
}
method.getvideos  = function() {
  return this.videos ;
}

method.setimages  = function(_images ) {
  this.images = _images;
}
method.getimages  = function() {
  return this.images ;
}

method.setcarousel_media  = function(_carousel_media ) {
  this.carousel_media = _carousel_media;
}
method.getcarousel_media  = function() {
  return this.carousel_media ;
}

method.setimageVersions2  = function(_imageVersions2) {
  this.imageVersions2 = _imageVersions2;
}
method.getimageVersions2 = function() {
  return this.imageVersions2;
}

method.settakenAt  = function(_code) {
  this.takenAt = _code;
}
method.gettakenAt = function() {
  return this.takenAt;
}

method.settext  = function(_text) {
  this.text = _text;
}
method.gettext = function() {
  return this.text;
}

method.setmediaType  = function(_code) {
  this.mediaType = _code;
}
method.getmediaType = function() {
  return this.mediaType;
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

module.exports = Post;
