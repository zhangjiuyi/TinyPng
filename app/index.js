/**
 *  监听事件
 */

const { 
  compress,
  compressDir, 
  findAvailableKey,
  addKey
} = require('./app/handleEvent')


document.querySelector('.validate').addEventListener('click', findAvailableKey)
document.querySelector('.compress').addEventListener('click', compress)
document.querySelector('.compress-dir').addEventListener('click', compressDir)
document.querySelector('.add-key').addEventListener('click', addKey)









