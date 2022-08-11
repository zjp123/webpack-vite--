/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-11-27 13:43:29
 * @description: 倒计时定时器
 */

import React, { FC, Fragment, useEffect, useState } from 'react'

interface IProps {
  count?: number
  fontSize?: number
  color?: string
  getCount?: Function
}

// 定时器 id
let timerId
const CountDown: FC<IProps> = props => {
  let { count = 5, fontSize, color = 'red', getCount } = props
  let [time, setTime] = useState(count)

  // 倒计时
  const countingDown = () => {
    if (time > 0) {
      setTime(--time)
      getCount && getCount(time)
    }
  }
  useEffect(() => {
    timerId = setInterval(countingDown, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])
  return (
    <Fragment>
      <span style={{ color: color, fontSize: `${fontSize}px` }}>{time}</span>
    </Fragment>
  )
}
export default CountDown
