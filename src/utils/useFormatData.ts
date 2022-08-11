import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ItemInterface } from '@/components/AdvancedList/itemInterface'

export const needActionItem = ['businessDetail', 'businessDetailName', 'businessType', 'businessTypeName', 'perdritype', 'source', 'sourceName', 'way', 'wayName']

export const splitData = data => {
  if (data && typeof data === 'string') {
    return data.split(',')
  }
}

export const mergeData = data => {
  if (data && data instanceof Array) {
    return data.join(',')
  } else {
    return data
  }
}
function useFormatData(startFlag: boolean, setStartFlag, formList: ItemInterface[], setFormData) {
  let temp
  useEffect(() => {
    if (startFlag) {
      temp = formList
      searchMatch(temp)
    }
  }, [startFlag, formList])


  const searchMatch = (formList: ItemInterface[]) => {
    for (let i = 0; i < formList.length; i++) {
      updateData(formList[i])
    }
    setFormData(formList)
    setStartFlag(false)
  }

  const updateData = (formData: ItemInterface) => {
    if (formData.myStatus === '保存') {
      needActionItem.forEach(item => {
        if (item in formData) {
          formData[item] = splitData(formData[item])
        }
      })
    } else if (formData.myStatus === '编辑') {
      needActionItem.forEach(item => {
        if (item in formData) {
          formData[item] = mergeData(formData[item])
        }
      })
    } else {
      console.log('未知状态')
    }
  }
}

export default useFormatData
