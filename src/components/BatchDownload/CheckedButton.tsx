import React, {useEffect} from "react";
import {Checkbox} from "antd";
import { connect } from "dva";

const CheckedButton = ({dispatch, checkedList, value, matchName}) => {
  // 批量下载
  const onChange = e => {
    if (e.target.checked) {
      dispatch({
        type: 'global/save',
        payload: {
          checkedList: [...checkedList, e.target.value]
        }
      })
    } else {
      dispatch({
        type: 'global/save',
        payload: {
          checkedList: matchName
            ? checkedList.filter(item => item[matchName] !== e.target.value[matchName])
            : checkedList.filter(item => item !== e.target.value)
        }
      })
    }
  };

  return <Checkbox
    checked={
      typeof value === "string"
        ? checkedList.includes(value)
        : !!checkedList.find(item =>  item[matchName] === value[matchName])
    }
    value={value}
    style={{marginRight: '10px'}}
    onChange={onChange} />
}

export default connect(({ global }) => ({
  checkedList: global.checkedList,
}))(CheckedButton)


