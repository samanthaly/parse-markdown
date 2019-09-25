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

let str = '以及标题！@#￥%%……&**（*（（ {#以及标题！@#￥%%……&**（*（（}';
// str = str.replace(/(\d+)\s* \s*(\{\#\d+\})/g, '$1');
str = str.replace(/(.+)\s* \s*(\{\#.+\})/g, '$1');
console.log(`str: ${str}`);
// function processStr(str) {
//   let resultStr = '';
//   for (let i = 0; i < str.length; i++) {
//     console.log(str[i]);
//   }
//   return resultStr;
// }

//1， 2， 3，4
function getSectionPosition(resultObj, level) {
  // let level = levelTypeMapping(contentType);
  let sPosition = resultObj.sections;
  for (let i = 2; i <= level; i++) {
    if (!sPosition[0]) {
      sPosition.push({ name: '', preParagraphs: [], sections: [] });
    }
    sPosition = sPosition[sPosition.length - 1].sections;
  }
  return sPosition;
}
let resultObj = { preParagraphs: [{ preParagraphs: [] }], sections: [] };

console.log(getSectionPosition(resultObj, 4));
console.log(JSON.stringify(resultObj));