/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-12-09 13:48:36
 * @description: 文件下载
 */
import request from '@/utils/request'

interface IOptions {
  filename?: string
  extension?: string

  [key: string]: any
}

//下载模版
function downloadFile(path: string, options?: IOptions, data?: any) {
  const { filename = '', extension = 'pdf' } = options || {}
  return request.downloadFileBlob(path, data, filename, extension)
}
//下载模版
function downloadFileJpg(path: string, options?: IOptions, data?: any) {
  const { filename = '', extension = 'jpg' } = options || {}
  return request.downloadFileBlob(path, data, filename, extension)
}
// 根据 url地址 下载文件
export const downloadFileByUrl = (url: string, options: IOptions = { filename: '当前下载文件' }) => {
  const { filename } = options
  const aLink = document.createElement('a')
  aLink.style.display = 'none'
  // aLink.target = "_blank"
  aLink.href = url
  // aLink.href = record;
  document.body.appendChild(aLink)
  aLink.download = filename
  aLink.click()
  document.body.removeChild(aLink)
}

export { downloadFile, downloadFileJpg }
