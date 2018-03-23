// 对 key 进行更新操作

const path  = require('path')
const fs  = require('fs')

module.exports = strText => {

  return new Promise( solve =>{

    fs.writeFile(path.resolve(`${__dirname}/keys.json`), strText, err =>{
      if (err) alert(`${err},write error`)
      solve('success')
    })
  })
}