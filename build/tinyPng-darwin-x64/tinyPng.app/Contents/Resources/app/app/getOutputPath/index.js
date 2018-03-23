/**
 * 图片输出目录
 */

const path = require('path'), 
      fs = require('fs')

module.exports = str =>{
  
  const dirName = path.dirname(str),
        outputPath = `${dirName}/TinyCompress`

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  } 
  return outputPath
}
