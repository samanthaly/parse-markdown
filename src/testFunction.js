/**
 * create by liteng on 2019-09-23
 * 用于测试一些函数
 */
'use strict';

const decoratesMapping = {
  '*': 'bold',
  '*': 'italic',
  '~~': 'strikethrough'
};
const decorates = [{ type: ['blod'], pos: 2 }];
decorates.find((value, index, arr) => {
  if (value.type[0] === 'blod') {
    value.length = 4;
  }
  // console.log(`value: ${JSON.stringify(value)}, index: ${index}, arr: ${JSON.stringify(arr)}`);
  return;
});
// console.log(`decorates: ${JSON.stringify(decorates)}`);
console.log('em_close'.endsWith('_start'));

let arr = [1, 3, 45, 34, 12];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === 45) continue;
  // console.log(`arr[${i}]: ${arr[i]}`);
}

let str = '13452345[二级标题正文内容]{.underline}34sdfasfd';
// str = str.replace(/(\[)\s*(.+)\s*\s*(.+\]\{\.underline\})/g, '$2');
// console.log(str);
function processUnderlineInStr(content) {
  let paraObj = {};
  if (!content.includes(']{.underline}')) {
    paraObj = { content: content, decorates: [] };
  } else {
    let tempContent = '', pos, length;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === '[') {
        pos = i;
      } else if (content[i] + content.substr(i + 1, 12) === ']{.underline}') {
        length = i - pos - 1;
        i = i + 12;
      } else {
        tempContent += content[i];
      }
    }
    paraObj = { content: tempContent, decorates: [{ pos: pos, length: length, type: ['underline'] }] };
  }
  return paraObj;
}
let resultObj = processUnderlineInStr(str);
console.log(`resultObj: ${JSON.stringify(resultObj)}`);
// console.log(str.includes('{.underline}'));