// 第一次运行项目时通过node执行此脚本
const fs = require('fs')
const path = require('path')
const wfPath =  path.resolve(__dirname, './node_modules/.bin')
 
fs.readdir(wfPath, (err, files)=>{
   if (err) {
    console.log(err);
   } else {
      if(files.length != 0 ) {
        files.forEach((item)=>{
           if(item.split('.')[1] === 'cmd') {
              replaceStr(`${wfPath}/${item}`, /"%_prog%"/, '%_prog%')
           }
        })
     }
   }
 })
 
// 参数：[文件路径、 需要修改的字符串、修改后的字符串] (替换对应文件内字符串的公共函数)
function replaceStr(filePath, sourceRegx, targetSrt) {
  fs.readFile(filePath, (err, data)=>{
     if(err) {
     console.log(err)
     } else {
       let str = data.toString();
     　str= str.replace(sourceRegx, targetSrt);
       fs.writeFile(filePath, str, (err)=> { console.log(err) })
     }
  })
}