import React from 'react'
import './index.less'

const ChartBorder = ({children, className = "", title = ""}) => {
  return (
    <div className={"chart-border " + className}>
      <div className='border-left-top border'></div>
      <div className='border-right-top border'></div>
      <div className='border-left-bottom border'></div>
      <div className='border-right-bottom border'></div>
      <div>
        <span className='title'>
        {title}
      </span>
      </div>
      <div className="children">
        {children}
      </div>
    </div>
  )
}

export default ChartBorder


