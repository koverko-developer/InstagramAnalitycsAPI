var method = UserInfo.prototype;

function UserInfo() {
  this.count_like = 0;
  this.count_comments = 0;
  this.count_view = 0;
  this.count_photo = 0;
  this.count_video = 0;
  this.count_carousel = 0;
}

method.setcount_comments  = function(_code) {
  this.count_comments = this.count_comments + _code;
}
method.getcount_comments = function() {
  return this.count_comments;
}

method.setcount_view  = function(_code) {
  this.count_view = this.count_view + _code;
}
method.getcount_view = function() {
  return this.count_view;
}

method.setnext_url  = function(_code) {
  this.next_url =  _code;
}
method.getnext_url = function() {
  return this.next_url;
}

method.setcount_like  = function(_code) {
  this.count_like = this.count_like + _code;
}
method.getcount_like = function() {
  return this.count_like;
}

method.setcount_photo  = function(_code) {
  this.count_photo = this.count_photo + _code;
}
method.getcount_photo = function() {
  return this.count_photo;
}


method.setcount_video  = function(_code) {
  this.count_video = this.count_video + _code;
}
method.getcount_video = function() {
  return this.count_video;
}

method.setcount_carousel  = function(_code) {
  this.count_carousel = this.count_carousel + _code;
}
method.getcount_carousel = function() {
  return this.count_carousel;
}
 module.exports = UserInfo;
