const detectionEditorContent = (content, type, isHasAppendix = false) => {
  if (type && type.length > 0) {
    if (isHasAppendix) {
      return type.find(item => item.name === '包含附件').code
    }
    const imgReg = /<img.*?/gi
    if (content.match(imgReg)) {
      return type.find(item => item.name === '图文').code
    }
    return type.find(item => item.name === '纯文字').code
  }
}

export default detectionEditorContent
