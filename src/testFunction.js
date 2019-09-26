/**
 * create by liteng on 2019-09-23
 * 用于测试一些函数
 */
'use strict';
const ShortUID = require('short-uid');
const idGen = new ShortUID();
const fs = require('fs');

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

function renameImageFile(oldPath = '') {
  let newFileObj = { path: '', fileName: '' };
  let oldPathArr = oldPath.split('/');
  let oldName = oldPathArr.pop();
  oldName = oldName.split('.');
  let fileExtension = oldName[0] && oldName[oldName.length - 1];
  let genId = idGen.randomUUID();
  newFileObj.fileName = `IMAGE_${genId}.${fileExtension.toLowerCase()}`;
  oldPathArr.pop();
  newFileObj.path = `${oldPathArr.join('/')}/${newFileObj.fileName}`;
  return newFileObj;
}

let oldPath = './data/wordImg/media/image2.png';

let newPath = renameImageFile(oldPath).path;
let fileName = ren
console.log(`oldPath: ${oldPath}, newPath: ${newPath}`);
// fs.rename(oldPath, newPath, err => {
//   if (err) {
//     console.log('重命名失败');
//   }
// });


// console.log(JSON.stringify(renameImageFile('./data/wordImg/media/image1.jpeg')));