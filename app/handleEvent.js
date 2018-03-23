/**
 * events handle
 * 
 * @JiuyiZhang
 */

const tinify = require("tinify"),
  path = require('path'),
  fs = require('fs'),
  keys = require('./updateKey/keys');

const CompressImage = require('./compressImage'),
  info = require('./infoText'),
  { dialog } = require('electron').remote


const getOutputPath = require('./getOutputPath')
const updateKey = require('./updateKey')



module.exports = class {

  constructor () {

    this.keyValue = document.querySelector('.key-value')

    this.openFile = {properties: ['openFile']}
    this.openDir = {properties: ['openDirectory']}
    this.dialogOption = {
      filters: [
        {name: 'ImageType', extensions:['jpg', 'png']}
      ]
    }
    this.compress = this.compress.bind(this)
    this.compressDir = this.compressDir.bind(this)
    this.addKey = this.addKey.bind(this)
  }


  // single image file compress
  compress() {
    let option = Object.assign(this.dialogOption, this.openFile)

    dialog.showOpenDialog(
      option,
      async path => {
  
        if (!path) return console.log(`取消选择`)

        new CompressImage(path, getOutputPath(path[0]))
      })
  }



  // multi images to compress
  compressDir () {
    let option = Object.assign(this.dialogOption, this.openDir)
    let _this = this

    dialog.showOpenDialog(
      option,
      path => {

        if (!path) return console.log(`取消选择`)
        
        // read dir
        fs.readdir(path[0], async (err, arr) => {
    
          if (err) throw err
          if (!arr.length) return alert('文件夹为空')
    
          const images = []  // save iamge list
    
          for ( let item of arr ) {
            if (/\.(jpg|png)$/.test(item)) {
              images.push(`${path[0]}/${item}`)
            }
          }

          new CompressImage(images, getOutputPath(path[0]))
      })
    })
  }


  // 添加 key
  async addKey () {

    const KEY = this.keyValue.value.trim()
    info.addKeyText()  // start add key...

    if(await this.isKeyAvailable(KEY)) {

      for (let key of keys) {
        if( key === KEY) return alert('key值已存在')
      }

      keys.unshift(KEY)
      alert(await updateKey(`${JSON.stringify(keys)}`))

    } else {

      info.keyUnavailableText()
    }
  }


  // key is available (无法检测当月压缩数量大过 500 的 key)
  isKeyAvailable (key) {
    return new Promise( resolve => {
      tinify.key = key 
      tinify.validate( err => resolve(!err))
    })   
  }
}


