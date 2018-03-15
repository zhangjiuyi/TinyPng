/**
 * events handle
 * 
 * @JiuyiZhang
 */

const tinify = require("tinify"),
      path =require('path'),
      fs = require('fs'),
      keys = require('./keys');

const toCompressImage = require('./compressImage'),
    { dialog } = require('electron').remote

const informDom = document.querySelector('.inform'),
      keyValue = document.querySelector('.key-value')


// single image file compress
exports.compress = function() {

  dialog.showOpenDialog({
    filters: [
      {name: 'ImageType', extensions:['jpg', 'png']}
    ],
    properties: ['openFile']
  }, path => {

    if (!path) return console.log(`没获取到路径`)

    const outputPath = getOutputPath(path[0])

    // start compress
    toCompressImage(path, outputPath)
      .then(count => {
        informDom.innerText = '压缩完成'
        alert('压缩完成')
      }).catch( errMsg => alert(errMsg) )
  })
}



// multi images to compress
exports.compressDir = function() {

  dialog.showOpenDialog({
    filters: [
      {name: 'ImageType', extensions:['jpg', 'png']}
    ],
    properties: ['openDirectory']
  }, path => {

    if (!path) return console.log(`没获取到路径`)
    
    const outputPath = getOutputPath(path[0])

    // red dir
    fs.readdir(path[0], (err, arr) => {

      if (err) throw err
      if (!arr.length) return alert('文件夹为空')

      const images = []  // save iamge list

      for ( let item of arr ) {
        if (/\.(jpg|png)$/.test(item)) {
          images.push(`${path[0]}/${item}`)
        }
      }

      // start compress
      toCompressImage(images, outputPath)
        .then(count => {
          informDom.innerText = '压缩完成'
          alert('压缩完成')
        }).catch( errMsg => alert(errMsg) )
    })
  })
}


// find available keys 
exports.findAvailableKey = async function() {
  informDom.innerText = '正在查找...'

  for (const key of keys) {
    let boolean  = await isKeyAvailable(key)
    if(boolean) {
      informDom.innerText = '已切换到可用的key'
      return tinify.key = key 
    }
  }
  informDom.innerText = '无可用key, 请自行申请添加!'
}


// add keys
exports.addKey = async function () {

  const KEY = keyValue.value.trim()
  
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


// create ouput path 
function getOutputPath(str) {
  
  const dirName = path.dirname(str),
        outputPath = `${dirName}/fontreImg_compress`

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  } 
  return outputPath
}



// key is available
function isKeyAvailable (key) {
  tinify.key = key 
  return new Promise( resolve => {
    tinify.validate( err => {
      if (err)  return resolve(false)
      resolve(true)
    })
  })   
}