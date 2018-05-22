/**
 * 先检查node的版本，如果主版本号<4，提示并且退出
 * 否则去执行createReateApp
 */
'use strict';

// 用来控制台输出的字体颜色和背景颜色的库
var chalk = require('chalk');

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
// var semver = process.version;
var major = semver[0];

if (major < 4) {
  console.error(
    chalk.red(
      'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Create React App requires Node 4 or higher. \n' +
        'Please update your version of Node.'
    )
  );
  // js是否终止线程，默认为0，1为失败
  process.exit(1);
}

require('./createReactApp');
