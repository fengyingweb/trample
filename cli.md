## 开发前端脚手架笔记

命令行执行文件顶部需要添加#!/usr/bin/env node --harmony 意思是在node中运行

代码:
````javascript
#!/usr/bin/env node --harmony

'use strict'

const program = require('commander');
const pkg = require('../package.json');
const init = require('../lib/init');
const list = require('../lib/list');
const addTemplate = require('../lib/add');
const delTemplate = require('../lib/del');

program
  .version(pkg.version, '-v, --version');

  // 查看模板列表命令
program
.command('list')
.description('查看模板列表')
.alias('l')
.action(()=> {
  list();
});

// 初始化项目
program
  .command('init [name]')
  .description('初始化工程模板, name(模板名称)')
  .alias('i')
  .action(name=> {
    init(name);
  });


// 添加模板命令
program
  .command('add <name> <gitUrl> <description>')
  .description('添加模板, name(模板名称), gitUrl(git仓库地址), description(描述)')
  .alias('a')
  .action((name, url, desc)=> {
    addTemplate(name, url, desc);
  });

// 删除模板命令
program
  .command('delete <name>')
  .description('删除模板, name(模板名称)')
  .alias('del')
  .action((name)=> {
    delTemplate(name);
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
````

安装依赖包使用命令:

> npm install <依赖包名称> --save 或者 yarn add <依赖包名称>

即把依赖包放在package.json的dependencies字段下, 否则发布到npm后, 全局安装脚手架不会安装所需要的依赖

### devDependencies与dependencies区别
首先需要说明的是Dependencies一词的中文意思是依赖和附属的意思，而dev则是

develop（开发）的简写。

所以它们的区别在 package.json 文件里面体现出来的就是，使用 --save-dev 安装的 插件，被写入到 devDependencies 域里面去，而使用 --save 安装的插件，则是被写入到 dependencies 区块里面去。

那 package.json 文件里面的 devDependencies  和 dependencies 对象有什么区别呢？

> npm install 【插件名】或 npm install 【插件名】--save 归属dependencies，表示代码运行时所需要的包。

> npm install 【插件名】--save-dev 归属 devDependencies，表示开发时依赖的插件（即不会打包至线上）。

devDependencies  里面的插件只用于开发环境，不用于生产环境, 而 dependencies  是需要发布到生产环境的。
