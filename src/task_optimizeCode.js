/**
 * create by samantha on 2019-09-24
 */
'use strict';
const ShortUID = require('short-uid');
const idGen = new ShortUID();
const fs = require('fs');

const paragraphTypeMapping = {
  'bullet_list_open-ul': 'bullet_open',
  'bullet_list_close-ul': 'bullet_end',
  'ordered_list_open-ol': 'ordered_open',
  'ordered_list_close-ol': 'ordered_end',
};
const tagMapping = {
  'heading_open-h1': '1',
  'heading_open-h2': '2',
  'heading_open-h3': '3',
  'heading_open-h4': '4',
  'paragraph_open-p': 'p',
  'table_open-table': 'table',
};
const decoratesMapping = {
  '**': 'bold',
  '*': 'italic',
  '~~': 'strikethrough',
  '^': 'superscript',
  '~': 'subscript'
};
function convertInToPx(num) {
  num = parseFloat(num);
  return Math.round(num * 96);
}
function renameImageFile(oldPath = '') {
  let newFileObj = { path: '', fileName: '' };
  let oldPathArr = oldPath.split('/');
  let oldName = oldPathArr.pop();
  oldName = oldName.split('.');
  let fileExtension = oldName[0] && oldName[oldName.length - 1];
  let genId = idGen.randomUUID();
  newFileObj.fileName = `IMAGE_${genId}.${fileExtension.toLowerCase()}`;
  oldPathArr.pop();
  newFileObj.path = `${oldPathArr.join('/')}/images/${newFileObj.fileName}`;
  return newFileObj;
}
function processUnderlineInStr(content) {
  let underlineStr = ']{.underline}';
  let paraObj = {};
  if (!content.includes(underlineStr)) {
    paraObj = { content: content, decorates: [] };
  } else {
    let tempContent = '', pos, length;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === '[') {
        pos = i;
      } else if (content[i] + content.substr(i + 1, 12) === underlineStr) {
        length = i - pos - 1;
        i = i + underlineStr.length - 1;
      } else {
        tempContent += content[i];
      }
    }
    paraObj = { content: tempContent, decorates: [{ pos: pos, length: length, type: ['underline'] }] };
  }
  return paraObj;
}
function convertDecoratesInChildren(childrenArr, contentType) {
  let paragraphObj = { content: '', decorates: [] };
  if (!childrenArr || !childrenArr[0]) {
    return paragraphObj;
  }
  for (let i = 0; i < childrenArr.length; i++) {
    let type = childrenArr[i].type;
    let markup = childrenArr[i].markup;
    if (type === 'text') {
      let processContent = contentType === 'p' ? childrenArr[i].content : childrenArr[i].content.replace(/(.+)\s* \s*(\{#.+\})/g, '$1');
      paragraphObj.content += processContent;
    } else if (type === 'softbreak' && childrenArr[i].tag === 'br') {
      paragraphObj.content += ' ';
    } else if (type.endsWith('_open')) {
      paragraphObj.decorates.push({ pos: paragraphObj.content.length, type: [decoratesMapping[markup]] });
    } else if (type.endsWith('_close')) {
      paragraphObj.decorates.find(value => {
        if (value.type[0] === decoratesMapping[markup]) {
          value.length = paragraphObj.content.length - value.pos;
        }
      });
    }
  }
  let tempContentObj = processUnderlineInStr(paragraphObj.content);
  paragraphObj.content = tempContentObj.content;
  paragraphObj.decorates = paragraphObj.decorates.concat(tempContentObj.decorates);
  return paragraphObj;
}
function convertChildrenPromise(childrenArr = [], contentType) {
  return new Promise((resolve, reject) => {
    if (!childrenArr[0] || !contentType) {
      return resolve({ type: 'paragraph', content: '', decorates: [] });
    }
    if (childrenArr[0].type === 'image') {
      let imagePath = childrenArr[0].attrs[0] ? childrenArr[0].attrs[0][1] : ''; // ./data/wordImg/media/image1.jpeg
      let imageFilePathObj = renameImageFile(imagePath);
      let newPath = imageFilePathObj.path;
      fs.rename(imagePath, newPath, err => {
        let fileName = imageFilePathObj.fileName;
        let timestamp = new Date().getTime();
        let imageId = `${timestamp}${timestamp}`;
        imageId = imageId.slice(0, 24);
        let widthAndHeight = convertDecoratesInChildren(childrenArr, contentType).content;
        widthAndHeight = widthAndHeight.split('"');
        let width = widthAndHeight[1] && widthAndHeight[1].slice(0, -2);
        let height = widthAndHeight[3] && widthAndHeight[3].slice(0, -2);
        width = convertInToPx(width);
        height = convertInToPx(height);
        return resolve({ type: 'image', id: imageId, fileName: fileName, width: width, height: height, caption: '无标题' });
      });
    } else {
      return resolve(convertDecoratesInChildren(childrenArr, contentType));
    }
  });
}

function getSectionPosition(contentObj, level) {
  if (!level) return;
  level = parseInt(level);
  let sPosition = contentObj.chapters;
  for (let i = 2; i <= level; i++) {
    if (!sPosition[0]) {
      sPosition.push({ name: '', preParagraphs: [], sections: [] });
    }
    sPosition = sPosition[sPosition.length - 1].sections;
  }
  return sPosition;
}
function processParagraph(paragraphType = '', paragraphObj) {
  let paraObj = {};
  if (paragraphObj.type === 'image') {
    paraObj = { image: { id: paragraphObj.id, fileName: paragraphObj.fileName, caption: paragraphObj.caption }, comment: null };
  } else {
    paraObj = { paragraph: paragraphObj.content, decorates: paragraphObj.decorates, refs: [], footnotes: [], comment: null };
  }
  if (paragraphType.endsWith('_open')) {
    let type = paragraphType.split('_')[0];
    paraObj = { list: { text: paragraphObj.content, type: type, decorates: paragraphObj.decorates, refs: [], footnotes: [] }, comment: null };
  }
  return paraObj;
}
function getContent(content, paragraphObj, contentType, paragraphType) {
  if (!getContent.pPosition) {
    getContent.pPosition = content.preParagraphs[0];
  }
  if (!getContent.sPosition) {
    getContent.sPosition = content.chapters;
  }
  if (contentType === 'p') {
    let paraObj = processParagraph(paragraphType, paragraphObj);
    getContent.pPosition.preParagraphs.push(paraObj);
  } else if (['1', '2', '3', '4'].indexOf(contentType) >= 0) {
    let sectionsObj = { name: paragraphObj.content, decorates: paragraphObj.decorates, preParagraphs: [], sections: [], comment: null };
    getContent.sPosition = getSectionPosition(content, contentType) || getContent.sPosition;
    getContent.sPosition.push(sectionsObj);
    getContent.pPosition = getContent.sPosition[getContent.sPosition.length - 1];
  }
  return content;
}
exports.convertToPaperModel = async function (originArr) {
  if (!originArr[0]) return;
  let paperModelObj = { content: { preParagraphs: [{ preParagraphs: [] }], chapters: [] }, image: [] };
  let contentObj = paperModelObj.content;
  let paragraphType, paragraphObj, contentType;
  for (let i = 0; i < originArr.length - 1; i++) {
    let key = `${originArr[i].type}-${originArr[i].tag}`; // 留下
    paragraphTypeMapping[key] ? paragraphType = paragraphTypeMapping[key] : ''; // 留下
    contentType = tagMapping[key] ? tagMapping[key] : contentType; // 留下
    if (originArr[i + 1].children === null) continue; // 留下
    paragraphObj = await convertChildrenPromise(originArr[i + 1].children, contentType); // 留下
    if (paragraphObj && paragraphObj.type === 'image') {
      paperModelObj.image.push({ id: paragraphObj.id, caption: paragraphObj.caption, fileName: paragraphObj.fileName, width: paragraphObj.width, height: paragraphObj.height });
    }
    contentObj = getContent(contentObj, paragraphObj, contentType, paragraphType);
  }
  return paperModelObj;
};
