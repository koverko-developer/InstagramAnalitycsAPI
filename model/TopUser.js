var method = TopUser.prototype;

function TopUser(_username, _fullname, _picture) {
  this.username = _username;
  this.count_comments = 0;
  this.fullname = _fullname;
  this.profile_picture = _picture;
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


 module.exports = TopUser;
