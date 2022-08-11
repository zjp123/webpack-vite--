import React, { FC, Fragment, useEffect, useState } from 'react'

interface IProps {
  fontSize?: number
  color?: string
}

// 定时器 id
let timerId
const TimerClock: FC<IProps> = props => {
  let [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    //每隔1秒调用一次创建时间函数
    timerId = setInterval(createTimerClock, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  function createTimerClock() {
    //获取系统当前的年、月、日、小时、分钟、毫秒
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let second = date.getSeconds()
    // let timeStr = year + '年' + month + '月' + day + '日  ' + check(hour) + ':' + check(minutes) + ':' + check(second)
    let timeStr = year + '-' + month + '-' + day + '  ' + check(hour) + ':' + check(minutes) + ':' + check(second)
    setTimeStr(timeStr)
  }

  // 判断时间是否为个位数，如果时间为个位数就在时间之前补上一个“0”
  function check(val) {
    if (val < 10) {
      return '0' + val
    } else {
      return val
    }
  }

  return (
    <Fragment>
      <span style={{}}>{timeStr}</span>
    </Fragment>
  )
}
export default TimerClock
