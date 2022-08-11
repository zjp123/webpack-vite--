/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-12-07 10:43:45
 * @description: 占位图  背景色 #F8F8FA
 */

import React, { Fragment, ReactNode } from 'react'
import { isEmpty } from '@/utils'
import { Image, Modal } from 'antd'
import replacement from '../../assets/img/replacement_small.png'

interface IProps {
  size?: string // 图片大小 默认 small,  small middle large
  width?: string | number // width/height 3:4
  height?: string | number
  rawUrl?: any
}

interface IOptions extends IProps {
  isExpand?: boolean
  rawUrl?: any
}

// 渲染替换图片
const renderReplacement = (props?: IProps) => {
  const { width = 30, height = 40, size = 'small', rawUrl } = props || {}
  let tem
  tem = rawUrl ? rawUrl : replacement
  return (
    <div style={{ backgroundColor: '#F8F8FA' }}>
      <Image width={width} height={height} src={tem} preview={false} />
    </div>
  )
}

// 添加点事件
const handleClick = options => {
  const { isExpand = false } = options || {}
  return (
    <Fragment>
      <Modal title={'图片详情'} visible={isExpand} width="60%" footer={null} onOk={() => {}} onCancel={() => {}}></Modal>
    </Fragment>
  )
}
const replacementPic = (val: any = '-', Images: ReactNode, options?: IOptions) => {
  if (!val) {
    val = '-'
  }
  const { isExpand = false } = options || {}
  return isEmpty(val) ? (
    renderReplacement(options) // 占位图
  ) : isExpand ? (
    <span onClick={() => handleClick(options)}>{Images}</span>
  ) : (
    Images
  ) // 原图
}

export default replacementPic
