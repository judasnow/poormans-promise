function PPromise (executor) {
  let self = this
  this.status = 'pending'
  this.data = undefined
  this.onResolvedCallback = []

  function resolve (value) {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.data = value
      for (let i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }

  function reject (reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason
      for (let i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](reason)
      }
    }
  }

  try {
    executor(resolve.bind(this), reject.bind(this));
  } catch (e) {
    reject.bind(this)(e)
  }
}

PPromise.prototype.then = function (onResolved, onRejected) {
  var self = this
  var promise2

  if (typeof onResolved !== 'function') {
    onResolved = function (v) {
    }
  }
  if (typeof onRejected !== 'function') {
    onRejected = function (r) {
    }
  }

  if (self.status === 'resolved') {
    return promise2 = new Promise(function (resolve, reject) {
      try {
        let x = onResolved(self.data)
        if (x instanceof PPromise) {
          x.then(resolve, reject)
        }
        resolve(x)
      } catch (e) {
        reject(e)
      }
    })
  }

  if (self.status === 'rejected') {
    return promise2 = new Promise(function (resolve, reject) {
      try {
        let x = onRejected(self.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  if (self.status === 'pending') {
    return promise2 = new Promise(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
      self.onRejectedCallback.push(function (reason) {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

new PPromise(resolve=>resolve(8))
.then(function foo(value) {
  console.log(value)
})

// export default PPromise