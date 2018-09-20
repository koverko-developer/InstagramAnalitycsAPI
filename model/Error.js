var method = Error.prototype;

function Error() {
  this.code = 901;
  this.error_message = "undefined user in db";
  this.error_type = "uuid"
}

  method.setCode  = function(_code) {
    this.code = _code;
  }
  method.getCode = function() {
    return this.code;
  }

  method.setError_message = function(_code) {
    this.error_message = _code;
  }
  method.getError_message = function() {
    return this.Error_message;
  }

  method.setError_type = function(_code){
    this.error_type = _code;
  }
  method.getError_type = function() {
    return this.error_type;
  }


 module.exports = Error;
