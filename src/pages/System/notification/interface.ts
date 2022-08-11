interface Notice {
  noticeName: string
  noticeType: string
  noticeContent: string
  annex: string
  noticeContentTemplate: string
  noticeFrequency: string
  noticeUserLevel: string
  schCodeList: string
  noticeStatus: string
  onlineTime: string
  offlineTime: string
}

export type SaveNotice = Partial<Notice>

type OmitType = { schCodeList: string }

export type UpdateNotice = Partial<Omit<Notice & { id: string }, keyof OmitType>>

interface DictTypeItem {
  name: string
  code: string
}

export type DictType<T> = {
  [key in keyof T]: DictTypeItem[]
}

export type InitDictType = Partial<
  DictType<{
    noticeType: string[]
    noticeStatus: string[]
    noticeFrequency: string[]
    noticeSchoolList: string[]
  }>
>

type OmitInitDictType = { noticeStatus: string[] }

export interface FileDetailBeforUpload {
  lastModified: number
  lastModifiedDate: Date | string
  name: string
  originFileObj: {
    uid?: string
    lastModified?: number
    lastModifiedDate?: Date
    name?: string
    size?: number
    type?: string
    webkitRelativePath?: string
  }
  percent: number
  response: {
    msg: string
    code: number
    data?: {
      uri: string
    }
  }
  size: number
  status: string
  type: string
  uid: string
  xhr: XMLHttpRequest | string | {}
  upload: XMLHttpRequestUpload | string | {}
}

export interface FileDetailToBackShow extends Partial<FileDetailBeforUpload> {
  msg: string
  code: number
  uri?: string
}

export type ModalDictType = Omit<InitDictType, keyof OmitInitDictType>
