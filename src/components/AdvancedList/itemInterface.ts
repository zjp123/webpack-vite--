export interface ItemInterface {
  id?: number
  name: string | string[]
  perdritype: string | string[]
  businessType: string | string[]
  businessTypeName?: string
  businessDetail: string | string[]
  businessDetailName?: string
  source: string | string[]
  sourceName?: string
  only: string | string[]
  onlyName?: string
  remark: string | string[]
  way: string | string[]
  wayName?: string
  myStatus: '编辑' | '保存'
  details: DetailInterface[]
}

export const initItem: ItemInterface = {
  name: undefined,
  perdritype: undefined,
  businessType: undefined,
  businessDetail: undefined,
  source: undefined,
  way: undefined,
  only: undefined,
  remark: undefined,
  myStatus: '保存',
  details: []
}

export interface DetailInterface<T = DictTypeInterface> {
  archiveCode: string | T | any
  archiveName: string | T
  archiveAlias: string | T
  isRequired: string | T
  isTransmission: string | T
  stage: string | T
  remark: string | T
}

export const initDetail: DetailInterface = {
  archiveCode: undefined,
  archiveName: undefined,
  archiveAlias: undefined,
  isRequired: undefined,
  isTransmission: undefined,
  stage: undefined,
  remark: undefined
}

export interface DictTypesInterface<T = DictTypeInterface> {
  perdritypeList: T[]
  bizTypeList: T[]
  archives_typeList: T[]
  sys_yes_no_numList: T[]
  driverSourceList: T[]
  student_wayList: T[]
  businessStatusList: T[]
}

export interface DictTypeInterface {
  code?: string
  children?: any[]
  customData?: string
  id?: string
  isActive?: number
  isDeleted?: number
  label: string
  name?: string
  photoUrl?: any
  value: string
}

export interface FormDataInterFace<T = DictTypeInterface> {
  perdritype: T | string | string[]
  businessType: T | string | string[]
  businessDetail: T | string | string[]
  details: DetailInterface<any>[]
}
