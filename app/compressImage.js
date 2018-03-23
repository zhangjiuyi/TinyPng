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

const Info = require('./infoText')


/**
 * 1 检测当前 key 是否可用
 * 2 不可用就 换key
 * 3 检测压缩数量
 * 4 压缩图片
 */


tinify.key = keys[0]


module.exports = class {

  constructor(images, outputPath) {
    this.info = new Info()
    this.count = 0  //图片计数
    this.keyIdx = 0  // key 索引数
    this.images = images
    this.totalImgCount = null //图片数量
    this.outputPath = outputPath
  }


  //  before compress
  async compressImage() {
    this.count = 0
    this.totalImgCount = this.images.length
    this.info.startText() 

    let result 

    for (let image of this.images) {

      const outputFile = `${this.outputPath}/${path.basename(image)}`

      result = await this.toCompress(image, outputFile)
    }

    return result
  }


  // compress ...
  toCompress (image, outFile) {

    return new Promise((resolve,reject) => {

      tinify.fromFile(image)
        .toFile(outFile, err => {

          this.info.keyCountText(tinify.compressionCount) 

          // hanlle key amount limit > 500
          if (tinify.compressionCount >= 500) {
            return this.handlekeyMax()
          }

          // handle error
          if (err) {
            return this.handleError(err)
          }

          this.toSuccess()
          resolve()
        })

      })
    
  }


  // key 超额处理
  handlekeyMax() {
    this.info.maxKeyCount()

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

    this.info.procssText (this.count, this.totalImgCount)

    if (this.count === this.totalImgCount) {
      this.info.successText()
    }
  }





  // 处理 error
  handleError(err) {
  
    switch (true) {
      case (err instanceof tinify.AccountError):
        alert(`当前key错误`)
        break
      case (err instanceof tinify.ConnectionError):
        alert(`网络连接错误`)
        break
      case (err instanceof tinify.ClientErrorr):
        alert(`检查你的图片选项`)
        break
      case (err instanceof tinify.ServerError):
        alert(`服务器错误`)
        break
      default:
        alert(`其他错误`)
    }
  }
}
