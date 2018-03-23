


module.exports = class{

  constructor () {
    this.infoDom = document.querySelector('.inform')
    this.keyCount = document.querySelector('.count')
    this.process = document.querySelector('.process')
  }

  startText () {
    this.infoDom.innerText= '准备压缩...'
  }

  keyCountText (count)  {
    this.keyCount.innerText = `${count}/500`
  }

  procssText(count, totalCount) {
    this.process.innerText = `压缩进度: ${count}/${totalCount}`
    
  }

  maxKeyCount() {
    alert('当前 key 当月压缩数量超额, 正在切换 key, 请稍等')
  }

  successText() {
    alert('压缩完成')
    this.infoDom.innerText= '压缩成功~!'
  }

 }