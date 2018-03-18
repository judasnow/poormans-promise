// const p1 = new Promise(function (resolve, reject) {
//   setTimeout(() => reject(new Error('fail 1024')), 2000)
// })

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve(1024)
  }, 2000)
})

p2
.then(result => {
  console.log(result)
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(2048)
    }, 1000)
  })
})
.then(result => console.log(result))
.catch(error => console.error(error))