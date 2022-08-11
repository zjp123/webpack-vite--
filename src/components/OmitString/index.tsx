import {Tooltip} from "antd";
import React, {useState} from "react";

const OmitString = (value: string, minLength: number, maxLength: number) => {
  const [innerWidth] = useState(window.innerWidth)
  const length = innerWidth <= 1500 ? minLength : maxLength
  if (value && value.length > length) {
    const showValue = value.slice(0, length)
    return <>
      {showValue}
      <Tooltip title={value}>
        <span className="omit-string">...</span>
      </Tooltip>
    </>
  }
  return value
}

export default OmitString
