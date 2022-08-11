import { FileDetailBeforUpload, FileDetailToBackShow } from '@/pages/System/notification/interface'
import {decode, encode} from "js-base64";

const toBackShow = (file: FileDetailToBackShow) => {
  let temp = { ...file }
  if (file.uri) {
    temp.response = {
      msg: file.msg,
      code: file.code,
      data: {
        uri: file.uri
      }
    }
    delete temp.msg
    delete temp.code
    delete temp.uri
  } else {
    temp.response = {
      msg: file.msg,
      code: file.code
    }
    delete temp.msg
    delete temp.code
  }
  // for (let key in temp) {
  //   temp[key] = decode(temp[key])
  // }
  return temp
}

const beforeUpload = (file: FileDetailBeforUpload) => {
  let temp = { ...file, ...file.response }
  delete temp.response
  if (temp.data) {
    temp = { ...temp, ...temp.data }
    delete temp.data
  }
  // for (let key in temp) {
  //   temp[key] = encode(temp[key])
  // }
  return temp
}

const formatJSON = {
  toBackShow: (json: FileDetailToBackShow[]) => json.map(toBackShow),
  beforeUpload: (json: FileDetailBeforUpload[]) => json.map(beforeUpload)
}

export default formatJSON
