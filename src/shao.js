'use strict';

const tagMapping = {
  'heading_open-h1': 'charpters',
  'heading_open-h2': 'sections',
  'heading_open-h3': 'subsections',
  'heading_open-h4': 'subsubsections',
  'paragraph_open-p': 'preParagraphs',
};

exports.convertToPaperModel = function (originArr) {
  if (!originArr || !originArr[0]) {
    return;
  }

  let resultObj = { preParagraphs: [], sections: [] };
  let currentParent = resultObj;
  let currentSection = resultObj;
  for (let i = 0; i < originArr.length - 1; i++) {
    let contentType = tagMapping[`${originArr[i].type}-${originArr[i].tag}`];
    let content = originArr[i + 1].content;

    if (contentType === 'charpters' || contentType === 'sections' || contentType === 'subsections' || contentType === 'subsubsections') {
      console.log(`---${i}---${contentType}, ${JSON.stringify(currentParent)}`);
      currentParent = currentSection;
      currentSection = { name: content, sections: [], preParagraphs: [] };
      currentParent.sections.push(currentSection);
    }
    if (contentType === 'subsubsections') {
      delete currentSection.sections;
    }

    if (contentType === 'preParagraphs') {
      currentSection.preParagraphs.push({ paragraph: content });
    }
  }

  resultObj.chapters = resultObj.sections;
  delete resultObj.sections;

  return resultObj;
}