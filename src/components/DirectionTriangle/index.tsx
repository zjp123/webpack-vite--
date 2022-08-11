/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @description: 纯css 方向三角形
 */

import React, { FC, Fragment } from 'react'
import './triangel.less'
interface IProps {
  fontSize?: number
  color?: string
  direction?: string
  type?: number | string
}

const renderTriangleDirection = props => {
  let { type = 0, direction = 'top' } = props
  if (type === 0) {
    direction = 'bottom'
  } else if (type === 1 || type === 2) {
    direction = 'top'
  } else {
    direction = direction
  }
  return React.createElement('div', { className: `${direction}_direction` })
}
const DirectionTriangle: FC<IProps> = props => {
  return <Fragment>{renderTriangleDirection(props)}</Fragment>
}
export default DirectionTriangle
