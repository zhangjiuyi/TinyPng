## 一个简单的只能用来压缩图片的小工具

### 前言：

由于部门内部经常要处理压缩图片， [tinyPng](https://tinypng.com/) 在线版的无损压缩做的很好， 但是批量的话一次最多只能处理20张，并且在线版的步骤比较繁琐，所以之前有用
[tinyPng API](https://tinypng.com/developers/reference/nodejs) 写过一段代码，自己用了一段时间，给部门新人用的时候发现他们还是喜欢图形化的界面，索性就用 [Electron](https://electronjs.org/) 打包了一个桌面版的图形化小工具， 如图：

![](http://oo88qkz8q.bkt.clouddn.com/18-3-13/69710687.jpg)


### 使用方法：

1. `npm i` 下载依赖
2. `npm i electron-packager -g` 全局安装打包工具
3. `npm run mac` 打包为 MacOs 系统下执行桌面文件
4. `npm run window` 打包为 Window 系统下可执行文件
5. `npm run linux` 打包为 Linux 系统下可执行文件

根据自己的系统 3，4，5 选一个。
执行文件生成在当前 `build` 目录下。




### 界面说明：

压缩图片： 选择一张图片压缩

批量压缩： 选择一个目录，压缩此目录下所有图片

压缩后的图片会在当前目录的 `fontreImg_compress` 文件夹内


### Key

因为工具内部本身用的是 TinyPny 的接口，接口必须要用到Key，每个 Key 每个月只能压缩500张图片，所以这里添加一个增加 Key 的入口，如果当前 Key 不可用，可以用非 QQ 邮箱来免费申请 Key 来添加


ps: 压缩数量会因为网络问题有一定误差，并不一定精确，工具本身需要联网




