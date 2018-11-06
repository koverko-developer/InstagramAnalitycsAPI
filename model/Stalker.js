var method = Stalker.prototype;

function Stalker(_username, _fullname, _picture, _id) {
  this.uname = _username;
  this.col_comments = 0;
  this.col_like = 0;
  this.fullname = _fullname;
  this.picture = _picture;
  this.id = _id;
}
method.setid  = function(_code) {
  this.id = _code;
}
method.getid = function() {
  return this.id;
}
method.setusername  = function(_code) {
  this.uname = _code;
}
method.getuname = function() {
  return this.uname;
}

method.setcol_comments  = function(_code) {
  this.col_comments = this.col_comments + _code;
}
method.getcol_comments = function() {
  return this.col_comments;
}

method.setcol_like  = function(_code) {
  this.col_like = this.col_like + _code;
}
method.getcol_like = function() {
  return this.col_like;
}

method.setfullname  = function(_code) {
  this.fullname = _code;
}
method.getfullname = function() {
  return this.fullname;
}

method.setprofile_picture  = function(_code) {
  this.picture = _code;
}
method.getpicture = function() {
  return this.picture;
}


 module.exports = Stalker;
