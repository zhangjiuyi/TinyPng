/**
 * events handle
 * 
 * @JiuyiZhang
 */

const tinify = require("tinify"),
      path =require('path'),
      fs = require('fs'),
      keys = require('./keys');

const CompressImage = require('./compressImage'),

    { dialog } = require('electron').remote


const getOutputPath = require('./getOutputPath')

const informDom = document.querySelector('.inform')


module.exports = class {

  constructor () {
    // this.compressImage = new CompressImage()

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

        this.compressImage = new CompressImage(path, getOutputPath(path[0]))

        try {

          await this.compressImage.compressImage()

        } catch(err) {
          alert(err)
        }
        
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

          this.compressImage = new CompressImage(images, getOutputPath(path[0]))
    
          // start compress
          try {

            let result = await _this.compressImage.compressImage()

          }catch (err) {
            alert(err)
          }
          
      })
    })
  }

  async addKey () {

    console.log(this.keyValue.value)

    const KEY = this.keyValue.value.trim()
  
    informDom.innerText = '' 

    let boolean = await isKeyAvailable(KEY)
  
    if(!boolean) {
      informDom.innerText = 'key值无效!' 

    } else {
  
      for (let key of keys) {
        if( key === KEY) return alert('该key值已存在~')
      }
      // console.log(keys)
      keys.unshift(KEY)
  
      let insertValue = `${JSON.stringify(keys)}`
  
      fs.writeFile(path.resolve(`${__dirname}/keys.json`), insertValue , err => {
        if (err)  return alert('添加失败')
        alert('添加key成功!')
      })
    }
  }
  
}





// find available keys 
exports.findAvailableKey = async function() {
  
  informDom.innerText = '正在查找...'

  for (const key of keys) {

    let boolean  = await isKeyAvailable(key)

    if(boolean) {
      informDom.innerText = '已切换到可用的key'
      console.log(key)
      return tinify.key = key 
    }
  }
  informDom.innerText = '无可用key, 请自行申请添加!'
}


// add keys
exports.addKey = async function () {

 
}





// key is available (无法检测当月压缩数量大过 500 的 key)
function isKeyAvailable (key) {

  return new Promise( resolve => {
    tinify.key = key 
    tinify.validate( err => {
      if (err)  return resolve(false)
      resolve(true)
    })
  })   
}