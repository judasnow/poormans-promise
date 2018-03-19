// https://github.com/kriskowal/q/tree/v1/design
var defer = function () {
  var pending = [], value;
  return {
    resolve: function (_value) {
      value = _value;
      for (var i = 0, ii = pending.length; i < ii; i++) {
        console.dir(i)
        var callback = pending[i];
        callback(value);
      }
      pending = undefined;
    },
    then: function (callback) {
      if (pending) {
        pending.push(callback);
      } else {
        callback(value);
      }
    }
  }
};

var oneOneSecondLater = function () {
  var result = defer();
  setTimeout(function () {
    result.resolve(1024);
  }, 1000);
  return result;
};

let p = oneOneSecondLater()
p.then(res => console.dir(res));
p.then(res => console.dir(res));
