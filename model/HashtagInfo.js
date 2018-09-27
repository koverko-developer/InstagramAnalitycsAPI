var method = HashtagInfo.prototype;

function HashtagInfo(_cl, _cc, _ca, _n) {
  this.count_like = _cl;
  this.count_comments = _cc;
  this.count_all = _ca;
  this.name = _n;
}

method.setcount_all  = function(_code) {
  this.count_all = this.count_all + _code;
}
method.getcount_all = function() {
  return this.count_all;
}

method.setname  = function(_code) {
  this.name =  _code;
}
method.getname = function() {
  return this.name;
}
method.setcount_comments  = function(_code) {
  this.count_comments = this.count_comments + _code;
}
method.getcount_comments = function() {
  return this.count_comments;
}

method.setcount_like  = function(_code) {
  this.count_like = this.count_like + _code;
}
method.getcount_like = function() {
  return this.count_like;
}

module.exports = HashtagInfo;
