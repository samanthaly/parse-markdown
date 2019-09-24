/**
 * create by liteng on 2019-09-19
 */
'use strict';

const originArr = ['h1', 123, 'h1', 1234, 'h3', 2345, 'h1', 'string', 'h2', 'abc', 'h4', 'string'];

let targetArr = [];
let level = 0;
for (let i = 0; i < originArr.length;) {
  if (originArr[i] === 'h1') {
    level = 1;
    targetArr.push({ 'h1': originArr[i + 1] });
    i = i + 2;
  } else if (originArr[i] === 'h2') {
    if (level === 1) {
      level = 2;
      targetArr[targetArr.length - 1]['h2'] = originArr[i + 1];
    } else {
      targetArr.push({ 'h2': originArr[i + 1] });
    }
    i = i + 2;
  } else if (originArr[i] === 'h3') {
    if ([1, 2].indexOf(level) >= 0) {
      level = 3;
      targetArr[targetArr.length - 1]['h3'] = originArr[i + 1];
    } else {
      targetArr.push({ 'h3': originArr[i + 1] });
    }
    i = i + 2;
  } else if (originArr[i] === 'h4') {
    if ([1, 2, 3].indexOf(level) >= 0) {
      level = 4;
      targetArr[targetArr.length - 1]['h4'] = originArr[i + 1];
    } else {
      targetArr.push({ 'h4': originArr[i + 1] });
    }
    i = i + 2;
  } else {
    i++;
  }
}

// console.log(`targetArr: ${JSON.stringify(targetArr)}`);


function processOriginArr(originArr) {
  let targetObj = { 'h1': [] };
  let level = 0;
  for (let i = 0; i < originArr.length;) {
    if (originArr[i] === 'h1') {
      targetObj['h1'].push({ name: 'h1', content: originArr[i + 1], 'h2': [] });
      level = 1;
      i = i + 2;
    } else if (originArr[i] === 'h2') {
      if (!targetObj['h1'][0]) { targetObj['h1'].push({ name: '', content: '', 'h2': [] }); }
      let h1Obj = targetObj['h1'][targetObj['h1'].length - 1];
      h1Obj['h2'].push({ name: 'h2', content: originArr[i + 1], 'h3': [] });
      level = 2;
      i = i + 2;
    } else if (originArr[i] === 'h3') {
      if (!targetObj['h1'][0]) {
        targetObj['h1'].push({ name: '', content: '', 'h2': [{ name: '', content: '', 'h3': [] }] });
      }
      let h1Obj = targetObj['h1'][targetObj['h1'].length - 1];
      let h2Arr = h1Obj['h2'];
      if (!h2Arr[0]) {
        h2Arr.push({ name: '', content: '', 'h3': [] });
      }
      h2Arr[h2Arr.length - 1]['h3'].push({ name: 'h3', content: originArr[i + 1], 'h4': [] });
      level = 3;
      i = i + 2;
    } else if (originArr[i] === 'h4') {
      if (!targetObj['h1']) {
        targetObj['h1'] = [{ name: '', content: '', 'h2': [{ name: '', content: '', 'h3': [{ name: '', content: '', 'h4': [] }] }] }];
      }
      let h1Obj = targetObj['h1'][targetObj['h1'].length - 1];
      let h2Arr = h1Obj['h2'];
      if (!h2Arr[0]) {
        h2Arr.push({ name: '', content: '', 'h3': [] });
      }
      let h3Arr = h2Arr[h2Arr.length - 1]['h3'];
      if (!h3Arr[0]) {
        h3Arr.push({ name: '', content: '', 'h4': [] });
      }
      h3Arr[h3Arr.length - 1]['h4'].push({ name: 'h4', content: originArr[i + 1] });
      level = 4;
      i = i + 2;
    } else {
      i++;
    }
  }
  return targetObj;
}
console.log(`resultObj : ${JSON.stringify(processOriginArr(originArr))}`);

module.exports = { processOriginArr };