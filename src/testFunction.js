/**
 * create by liteng on 2019-09-23
 * 用于测试一些函数
 */
'use strict';
const ShortUID = require('short-uid');
const idGen = new ShortUID();
const fs = require('fs');

console.log(Date.now().toString(16) + Math.random().toString(16).substr(2,28));
console.log(Date.now().toString(16) + Math.random().toString(16).substr(2,28));