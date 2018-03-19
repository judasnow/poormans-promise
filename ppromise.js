// 简单实现的 promise
function PPromise (executor) {
  let self = this;

  this.status = 'pending';
  this.data = undefined;

  this.onResolvedCallback = [];
  this.onRejectedCallback = [];

  // 以下两个方法都是在 executor 方法中调用
  // 用来改变 promise 对象的状态，以及值
  function resolve (value) {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.data = value;
      // 依次调用已经绑定的成功回调
      for (let i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }

  function reject (reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.data = reason;
      // 依次调用已经绑定的失败回调
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

// 注册回调函数
// 总是会返回一个新的 promise 对象
PPromise.prototype.then = function (onResolved, onRejected) {
  // 这里会根据调用 then 时，promise 对象的不同状态进行不同的处理
  console.log(this.status)

  let self = this
  let promise2

  // 两个回调只能是函类型
  if (typeof onResolved !== 'function') {
    onResolved = function (v) {
      return v
    }
  }
  if (typeof onRejected !== 'function') {
    onRejected = function (r) {
      return r
    }
  }

  if (self.status === 'resolved') {
    return new PPromise(function (resolve, reject) {
      try {
        // onResolved 的返回值，决定 promise2 的值
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
    return new PPromise(function (resolve, reject) {
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

  // 最常见的应该是这种情况
  if (self.status === 'pending') {
    // 将 onResolved 以及 onRejected 同时添加到新的 promise 中
    return new PPromise(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          let x = onResolved(self.data)
          if (x instanceof PPromise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      });
      self.onRejectedCallback.push(function (reason) {
        try {
          let x = onRejected(self.data)
          if (x instanceof PPromise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

new PPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(1024)
  }, 1000)
}).then(function (v) {
  console.dir(v)
})

// export default PPromise