/**
 * compress image 
 * 
 * @JiuyiZhang
 */

const tinify = require("tinify"),
  path = require('path'),
  fs = require('fs')


const updateKey = require('./updateKey')
const keys = require('./updateKey/keys')

const info = require('./infoText')


/**
 * 1 检测当前 key 是否可用
 * 2 不可用就 换key
 * 3 检测压缩数量
 * 4 压缩图片
 */


tinify.key = keys[0]




module.exports = class {

  constructor(images, outputPath) {
    this.count = null  //图片计数
    this.totalImgCount = null //图片数量

    this.keyIdx = 0  // key 索引数
    this.images = images  // image array
    this.outputPath = outputPath

    this.initCompress()
  }


  //  before compress
  async initCompress() {

    this.count = 0
    this.totalImgCount = this.images.length
    info.startText() 

    for (let image of this.images) {

      const outFile = `${this.outputPath}/${path.basename(image)}`

      await this.toCompress(image, outFile)
        .catch(err => {alert(err); throw err})

      this.toSuccess()
    }
  }


  // compress ...
  toCompress (image, outFile) {

    return new Promise((resolve,reject) => {

      tinify.fromFile(image)
        .toFile(outFile, err => {

          info.keyCountText(tinify.compressionCount) 

          // hanlle key amount limit > 500
          if (tinify.compressionCount >= 500) {
            return this.handlekeyMax()
          }
          // handle error
          if (err) {
            return this.handleError(err, reject)
          }

          resolve()
        })
      })
  }


  // key 超额处理
  handlekeyMax() {
    info.maxKeyCount()

    tinify.key = keys[++this.keyIdx]

    //更新 key 位置
    keys.push(keys.shift())
    updateKey(`${JSON.stringify(keys)}`)

    //重新运行
    return this.compressImage()
  }

 

  // success
  toSuccess () {
    this.count++

    info.procssText (this.count, this.totalImgCount)
    info.compressingText()
    if (this.count === this.totalImgCount) {
      info.successText()
    }
  }



  // 处理 error
  handleError(err, reject) {
    console.log(err)
    switch (true) {
      case (err instanceof tinify.AccountError):

        reject(`当前key错误`)
        break
      case (err instanceof tinify.ConnectionError):
        reject(`网络连接错误`)
        break
      case (err instanceof tinify.ClientErrorr):
        reject(`检查图片选项`)
        break
      case (err instanceof tinify.ServerError):
        reject(`服务器错误`)
        break
      default:
        reject(`其他错误`)
    }
  }
}
