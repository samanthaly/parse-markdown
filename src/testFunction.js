/**
 * create by liteng on 2019-09-23
 * 用于测试一些函数
 */
'use strict';
const ShortUID = require('short-uid');
const idGen = new ShortUID();
const fs = require('fs');
const querystring = require('querystring');

// console.log(querystring.escape('第一条脚注'));
// console.log(querystring.unescape('%E7%AC%AC%E4%B8%80%E6%9D%A1%E8%84%9A%E6%B3%A8'));


const REPLACE_MAPPING = {
  'in"}': 'in"}\n\n',
  '![](': '\n\n![]('
};
function replaceTextByReplaceMapping(text) {
  if (!text) return text;
  text = text.replace(/(in"})|(!\[\]\()/g, function (matched) {
    console.log(matched);
    return REPLACE_MAPPING[matched];
  });
  return text;
}

let str = `下图展示的是![](./data/wordImg/media/image1.png){width="4.357638888888889in"
height="3.6104166666666666in"}下图展示的是`;
// str = str.replace(/(\!)\s* \s*(.+)/, '$1'); // replace(/(.+)\s* \s*(\{#.+\})/g, '$1');
// str = str.replace(/in"}/g, 'in"}\n');
// str = str.replace(/!\[\]\(/g, '\n![](');
console.log(replaceTextByReplaceMapping(str));
// let str1 = 'in"}啦啦啦';
// str1 = str1.replace(/in"}/, 'in"}\n');
// console.log(str1);