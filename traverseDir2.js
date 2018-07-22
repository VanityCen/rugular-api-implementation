/**
 * 广度遍历文件夹的文件名
 */
let fs = require('fs')
let path = require('path')

function traverseDir2 (dir, callback) {
  let files = []

  eachFile(
    dir,
    (filenames, next) => {
      files.push(...filenames)
      next()
    },
    (err) => {
      callback(err, files)
    }
  )
}

function eachFile (dir, findOne, callback) {
  fs.stat(dir, (err, stats) => {
    if (err) return callback(err)

    if (stats.isFile()) {
      callback(null)
    } else if (stats.isDirectory()) {
      fs.readdir(dir, (err, filenames) => {
        if (err) return callback(err)

        filenames = filenames.map(f => {
          return path.join(dir, f)
        })

        findOne(filenames, () => {
          let next = () => {
            let f = filenames.pop()
            if (!f) return callback(null)

            eachFile(f, findOne, next)
          }

          next()
        })
      })
    } else {
      callback(null)
    }
  })
}

module.exports = traverseDir2