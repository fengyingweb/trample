function replace (source) {
  var regex = /import App from \'\.\/App\';?/gi
  var sourceTemp = source.replace(regex, "import App from '@/views/App';")
  sourceTemp += "import 'vant/lib/icon/local.css'" // 自动引入字体图标文件
  // console.log('sourceTemp = ', sourceTemp)
  return sourceTemp
}
module.exports = function (content) {
  return replace(content)
}
