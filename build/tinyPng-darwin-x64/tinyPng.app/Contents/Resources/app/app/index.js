/**
 *  监听事件
 */

// const { 
//   compress,
//   compressDir, 
//   findAvailableKey,
//   addKey
// } = require('')


const HandleEvnet = require('./app/handleEvent')
const handleEvent = new HandleEvnet()


// document.querySelector('.validate').addEventListener('click', findAvailableKey)
document.querySelector('.compress').addEventListener('click', handleEvent.compress)
document.querySelector('.compress-dir').addEventListener('click',handleEvent.compressDir)
document.querySelector('.add-key').addEventListener('click', handleEvent.addKey)









