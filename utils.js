// 转换文件大小
const formatFileSize = (val) => {
  if (val === 0) {
    return '0 B'
  }
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(val) / Math.log(k))
  return (val / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}
