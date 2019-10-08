/**
 * create by liteng on 2019-09-23
 * 用于测试一些函数
 */
'use strict';
const ShortUID = require('short-uid');
const idGen = new ShortUID();
const fs = require('fs');
const querystring = require('querystring');

console.log(querystring.escape('第一条脚注'));
console.log(querystring.unescape('%E7%AC%AC%E4%B8%80%E6%9D%A1%E8%84%9A%E6%B3%A8'));

console.log(Date.now().toString(16) + Math.random().toString(16).substr(2, 28));
console.log(Date.now().toString(16) + Math.random().toString(16).substr(2, 28));