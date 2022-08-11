import React, { FC } from 'react'
import { Image } from 'antd'
import { connect } from 'dva'
import fallback from './fallback.png'
import { store } from '@/store'
interface Props {
  src: string
  enlarge?: boolean
  width?: number
  height?: number
  style?: any
  alt?: string
}

// 图片
const Images: FC<Props> = props => {
  const { src, enlarge, width, height, style, alt } = props
  const { storeData = {} } = store.getState()
  let { fileDomainUrl } = storeData
  const url = !src ? fallback : src.includes('http') ? src : fileDomainUrl + src
  return enlarge ? (
    <Image
      src={url}
      width={width}
      height={height}
      style={{ ...style }}
      onContextMenu={e => {
        e.preventDefault()
        return false
      }}
    />
  ) : (
    <Image
      src={url}
      width={width}
      height={height}
      style={{ ...style }}
      alt={alt}
      preview={false}
      onContextMenu={e => {
        e.preventDefault()
        return false
      }}
    />
  )
  // <img src={url} style={{ marginRight: 0, width: width + "px", height: `${height}px`, ...style }}/>
}

export default connect(() => ({}))(Images)

Images.defaultProps = {
  enlarge: true
  // width: 40,
  // height: 30,
}
