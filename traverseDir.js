/**
 * traverse the given directory to get all filenames
 */
let fs = require('fs')
let path = require('path')
function traverseDir (dir, callback) {
  let files = []

  eachFile(
    dir,
    (filename, next) => {
      files.push(filename)
      next()
    },
    (err) => {
      callback(err, files)
    })
}

function eachFile(dir, findOne, callback) {
  fs.stat(dir, (err, stats) => {
    if (err) return callback(err)

    findOne(dir, () => {
      if (stats.isFile()) {
        callback(null)
      } else if (stats.isDirectory()) {
        fs.readdir(dir, (err, files) => {
          if (err) return callback(err)

          files = files.map((f) => {
            return path.join(dir, f)
          })

          let next = () => {
            let f = files.pop()
            if (!f) return callback(null)
            
            eachFile(f, findOne, next)
          }

          next()
        })
      } else {
        callback(null)
      }
    })
  })
}

module.exports = traverseDir