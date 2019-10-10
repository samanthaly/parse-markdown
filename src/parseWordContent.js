/**
 * create by samantha on 2019-09-24
 */
'use strict';
const ShortUID = require('short-uid');
const idGen = new ShortUID();
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const querystring = require('querystring');


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
  'table_open-table': 'table_open',
  'table_close-table': 'table_close',
  'th_open-th': 'th',
  'tr_open-tr': 'tr',
  'td_open-td': 'td',
};
const decoratesMapping = {
  'strong': 'bold',
  'em': 'italic',
  's': 'strikethrough',
  'sup': 'superscript',
  'sub': 'subscript'
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
function convertDecoratesInChildren(childrenArr = [], contentType) {
  let paragraphObj = { content: '', decorates: [], footnotes: [] };
  if (!childrenArr[0]) {
    return paragraphObj;
  }
  let footnote = {}, decoratesObj = {}, processContent, processType, decorateType, state, pos;
  for (let i = 0; i < childrenArr.length; i++) {
    let { type, content, tag } = childrenArr[i];
    if (type === 'text') {
      processContent = contentType === 'p' ? content : content.replace(/(.+)\s* \s*(\{#.+\})/g, '$1');
      paragraphObj.content += processContent;
    } else if (type === 'softbreak') {
      tag === 'br' ? paragraphObj.content += ' ' : '';
    } else if (type === 'link_open') {
      let footnoteId = uuidv1();
      paragraphObj.footnotes.push({ pos: pos, id: footnoteId });
      footnote = { id: footnoteId, text: querystring.unescape(childrenArr[i].attrs[0][1]) };
      i = i + 2;
    } else if (type.endsWith('_open')) {
      processType = type.split('_');
      decorateType = decoratesMapping[processType[0]];
      state = processType[1];
      pos = paragraphObj.content.length;
      if (decoratesObj[decorateType]) {
        delete decoratesObj[decorateType];
      }
      decoratesObj[decorateType] = { state, pos, type: [decorateType] };
    } else if (type.endsWith('_close')) {
      processType = type.split('_');
      decorateType = decoratesMapping[processType[0]];
      if (!decoratesObj[decorateType]) {
        continue;
      }
      state = processType[1];
      let decorateTemp = decoratesObj[decorateType];
      if (decorateTemp.state === 'open') {
        decorateTemp.length = paragraphObj.content.length - decorateTemp.pos;
        delete decorateTemp.state;
        paragraphObj.decorates.push(decorateTemp);
        delete decoratesObj[decorateType];
      }
    }
  }
  let tempContentObj = processUnderlineInStr(paragraphObj.content);
  paragraphObj.content = tempContentObj.content;
  paragraphObj.decorates = paragraphObj.decorates.concat(tempContentObj.decorates);
  return { paragraphObj, footnote };
}
function convertChildrenPromise(childrenArr = [], contentType) {
  return new Promise((resolve, reject) => {
    if (!childrenArr || !childrenArr[0] || !contentType) {
      return resolve({ paragraphObj: { type: 'paragraph', content: '', decorates: [] } });
    }
    if (childrenArr[0].type === 'image') {
      let imagePath = childrenArr[0].attrs[0] ? childrenArr[0].attrs[0][1] : ''; // ./data/wordImg/media/image1.jpeg
      let imageFilePathObj = renameImageFile(imagePath);
      let newPath = imageFilePathObj.path;
      fs.rename(imagePath, newPath, err => {
        let fileName = imageFilePathObj.fileName;
        let imageId = uuidv1();
        let widthAndHeight = convertDecoratesInChildren(childrenArr, contentType).paragraphObj.content;
        widthAndHeight = widthAndHeight.split('"');
        let width = widthAndHeight[1] && widthAndHeight[1].slice(0, -2);
        let height = widthAndHeight[3] && widthAndHeight[3].slice(0, -2);
        width = convertInToPx(width);
        height = convertInToPx(height);
        return resolve({ paragraphObj: { type: 'image', id: imageId, fileName: fileName, width: width, height: height, caption: '(无标题)' } });
      });
    } else {
      return resolve(convertDecoratesInChildren(childrenArr, contentType));
    }
  });
}
// 此函数和项目中的不同
function convertTablePromise(tableType, content, thesisPath, callback) {
  return new Promise((resolve, reject) => {
    if (!convertTablePromise.data && tableType === 'table_open') {
      convertTablePromise.data = { header: [], body: [] };
    }
    let tableObj = { id: '', caption: '(无标题)', source: '', fileName: '', imgFileName: '', data: null };

    if (tableType === 'th') {
      content ? convertTablePromise.data.header.push(content) : '';
    } else if (tableType === 'td' && convertTablePromise.tableType === 'tr') {
      convertTablePromise.data.body[convertTablePromise.data.body.length] = [];
      convertTablePromise.eachBody = convertTablePromise.data.body[convertTablePromise.data.body.length - 1];
    } else if (tableType === 'td') {
      content ? convertTablePromise.eachBody.push(content) : '';
    }

    convertTablePromise.tableType = tableType;
    if (tableType === 'table_close') {
      let timestamp = new Date().getTime();
      tableObj.id = idGen.randomUUID();
      tableObj.fileName = `TABLE_${timestamp}`;
      tableObj.imgFileName = `${tableObj.fileName}.png`;
      tableObj.data = convertTablePromise.data;
      convertTablePromise.data = null;
      // let uploadPath = thesisPath + '/files';
      // utils.createFolderIfNotExist(uploadPath);
      // convertDataToImage(tableObj.data, tableObj.fileName, uploadPath, result => {
      //   if (result) {
      //     tableObj.imgFileName = result;
      //     return resolve(tableObj);
      //   } else {
      //     return resolve({ data: null });
      //   }
      // });
      return resolve(tableObj);
    } else {
      return resolve({ data: null });
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
  } else if (paragraphObj.content.startsWith('$$') && paragraphObj.content.endsWith('$$')) {
    let formulaId = uuidv1();
    let formulaText = paragraphObj.content.slice(2, -2);
    paraObj = { formula: { id: formulaId, text: formulaText }, comment: null };
  } else {
    paraObj = { paragraph: paragraphObj.content, decorates: paragraphObj.decorates, refs: [], footnotes: paragraphObj.footnotes, comment: null };
  }
  if (paragraphType.endsWith('_open')) {
    let type = paragraphType.split('_')[0];
    paraObj = { list: { text: paragraphObj.content, type: type, decorates: paragraphObj.decorates, refs: [], footnotes: paragraphObj.footnotes }, comment: null };
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
  let formulaObj = {};
  if (contentType === 'p') {
    let paraObj = processParagraph(paragraphType, paragraphObj);
    getContent.pPosition.preParagraphs.push(paraObj);
    if (paraObj.formula) {
      formulaObj.id = paraObj.formula.id;
      formulaObj.formula = paraObj.formula.text;
    }
  } else if (['1', '2', '3', '4'].indexOf(contentType) >= 0) {
    let sectionsObj = { name: paragraphObj.content, decorates: paragraphObj.decorates, preParagraphs: [], sections: [], footnotes: paragraphObj.footnotes, comment: null };
    getContent.sPosition = getSectionPosition(content, contentType) || getContent.sPosition;
    getContent.sPosition.push(sectionsObj);
    getContent.pPosition = getContent.sPosition[getContent.sPosition.length - 1];
  } else if (contentType === 'table_close' && paragraphObj.table) {
    getContent.pPosition.preParagraphs.push(paragraphObj);
  }
  return { content, formula: formulaObj };
}
exports.convertToPaperModel = async function (originArr, thesisPath) {
  if (!originArr[0]) return;
  let paperModelObj = { content: { preParagraphs: [{ preParagraphs: [] }], chapters: [] }, image: [], table: [], formula: [], footnote: [] };
  let contentObj = paperModelObj.content;
  let paragraphType, paragraphObj, contentType, tableObj;
  let contentResultObj;

  for (let i = 0; i < originArr.length - 1; i++) {
    let key = `${originArr[i].type}-${originArr[i].tag}`;
    paragraphTypeMapping[key] ? paragraphType = paragraphTypeMapping[key] : '';
    contentType = tagMapping[key] ? tagMapping[key] : contentType;

    tableObj = await convertTablePromise(contentType, originArr[i].content, thesisPath);
    if (tableObj.data) {
      paragraphObj = { table: { id: tableObj.id, caption: tableObj.caption, source: tableObj.source, imgFileName: tableObj.imgFileName }, comment: null };
      paperModelObj.table.push({ id: tableObj.id, caption: tableObj.caption, source: tableObj.source, fileName: tableObj.fileName, imgFileName: tableObj.imgFileName, data: tableObj.data });
    } else {
      if (originArr[i + 1].children === null) continue;
      let convertChildrenResult = await convertChildrenPromise(originArr[i + 1].children, contentType);
      paragraphObj = convertChildrenResult.paragraphObj;
      if (convertChildrenResult.footnote && convertChildrenResult.footnote.id) {
        paperModelObj.footnote.push(convertChildrenResult.footnote);
      }
      if (paragraphObj && paragraphObj.type === 'image') {
        paperModelObj.image.push({ id: paragraphObj.id, caption: paragraphObj.caption, fileName: paragraphObj.fileName, width: paragraphObj.width, height: paragraphObj.height });
      }
    }
    contentResultObj = getContent(contentObj, paragraphObj, contentType, paragraphType);
    contentObj = contentResultObj.content;
    if (contentResultObj.formula.id) {
      paperModelObj.formula.push(contentResultObj.formula);
    }
  }
  return paperModelObj;
};
