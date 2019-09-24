/**
 * create by samantha on 2019-09-23
 */
'use strict';
const childrenArr = [
  {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "Hello ",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "s_open",
    "tag": "s",
    "attrs": null,
    "map": null,
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "~~",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "em_open",
    "tag": "em",
    "attrs": null,
    "map": null,
    "nesting": 1,
    "level": 1,
    "children": null,
    "content": "",
    "markup": "*",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 2,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "strong_open",
    "tag": "strong",
    "attrs": null,
    "map": null,
    "nesting": 1,
    "level": 2,
    "children": null,
    "content": "",
    "markup": "**",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 3,
    "children": null,
    "content": "Word",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "strong_close",
    "tag": "strong",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 2,
    "children": null,
    "content": "",
    "markup": "**",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 2,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "em_close",
    "tag": "em",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 1,
    "children": null,
    "content": "",
    "markup": "*",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "s_close",
    "tag": "s",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "~~",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  }
];
//转化成 {paragraph: '二级标题正文内容...对对对...', decorates: [pos: 2, length: 2, type: ['bold']]}

const decoratesMapping = {
  '**': 'bold',
  '*': 'italic',
  '~~': 'strikethrough'
};

function convertBold(originArr) {
  let resultObj = { paragraph: '', decorates: [] };
  for (let i = 0; i < originArr.length; i++) {
    switch (originArr[i].type) {
      case 'text':
        resultObj.paragraph += originArr[i].content;
        break;
      case 'strong_open':
        resultObj.decorates.push({
          pos: resultObj.paragraph.length,
          length: originArr[i + 1].content.length,
          type: [decoratesMapping[originArr[i].markup]]
        });
        break;
      default:
        break;
    }
  }
  return resultObj;
}

function convertDecoratesInChildren(childrenArr) {
  let paragraphObj = { paragraph: '', decorates: [] };
  for (let i = 0; i < childrenArr.length; i++) {
    let type = childrenArr[i].type;
    let markup = childrenArr[i].markup;
    if (type === 'text') {
      paragraphObj.paragraph += childrenArr[i].content;
    } else if (type.endsWith('_open')) {
      paragraphObj.decorates.push({ pos: paragraphObj.paragraph.length, type: [decoratesMapping[markup]] });
    } else if (type.endsWith('_close')) {
      paragraphObj.decorates.find(value => {
        if (value.type[0] === decoratesMapping[markup]) {
          value.length = paragraphObj.paragraph.length - value.pos;
        }
      });
    } else {
      return;
    }
  }
  return paragraphObj
}
let resultObj = convertDecoratesInChildren(childrenArr);
console.log(`resultObj: ${JSON.stringify(resultObj)}`);