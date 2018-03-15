/**
 * compress image 
 * 
 * @JiuyiZhang
 */

const tinify = require("tinify"),  
      path = require('path'),
      fs = require('fs'),
      keys = require('./keys');


const informDom = document.querySelector('.inform'),
    COMPRESS_COUNT =  document.querySelector('.count');

tinify.key = keys[0]



// compress image 
module.exports = (images, outputPath) => {

  let count = 0
  informDom.innerText = '开始压缩...'

  return new Promise( (resolve, reject) => {

    for (let image of images) {
      const outputName = path.basename(image)

      tinify.fromFile(image)
        .toFile(`${outputPath}/${outputName}`, err => {
          // handle error
          if (err) return handleError(err, reject)
          
          // console.log(tinify.compressionCount)
          COMPRESS_COUNT.innerText = tinify.compressionCount

          // compress success
          count++
          informDom.innerText = `压缩进度: ${count}/${images.length}` 
          if (count === images.length) resolve()
        })
    }
  })
}


// handle error
function handleError(err, reject) {
  console.log(err.message)

  switch (true) {
    case (err instanceof tinify.AccountError):
      reject(`key值无效`)
      break
    case (err instanceof tinify.ConnectionError):
      reject(`网络连接错误`)
      break
    case (err instanceof tinify.ClientErrorr):
      reject( `检查你的图片选项`)
      break
    case (err instanceof tinify.ServerError):
      reject(`服务器错误`)
      break
    default: 
      reject(`其他错误`)
  }
}