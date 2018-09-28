var method = Stalker.prototype;

function Stalker(_username, _fullname, _picture, _id) {
  this.username = _username;
  this.count_comments = 0;
  this.count_likes = 0;
  this.fullname = _fullname;
  this.profile_picture = _picture;
  this.id = _id;
}
method.setid  = function(_code) {
  this.id = _code;
}
method.getid = function() {
  return this.id;
}
method.setusername  = function(_code) {
  this.username = _code;
}
method.getusername = function() {
  return this.username;
}

method.setcount_comments  = function(_code) {
  this.count_comments = this.count_comments + _code;
}
method.getcount_comments = function() {
  return this.count_comments;
}

method.setcount_likes  = function(_code) {
  this.count_likes = this.count_likes + _code;
}
method.getcount_likes = function() {
  return this.count_likes;
}

method.setfullname  = function(_code) {
  this.fullname = _code;
}
method.getfullname = function() {
  return this.fullname;
}

method.setprofile_picture  = function(_code) {
  this.profile_picture = _code;
}
method.getprofile_picture = function() {
  return this.profile_picture;
}


 module.exports = Stalker;
