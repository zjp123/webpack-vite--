import React, {FC, useEffect} from "react";
import {Checkbox} from "antd";
import { connect } from "dva"

interface Props {
  dispatch: Function,
  checkedList: any[],
  indeterminate: boolean,
  checkAll: boolean,
  plainOptions: any[],
  list: any[],
  itemName: string | string[]
}

const CheckedAllButton: FC<Props> = ({dispatch, checkedList, indeterminate, checkAll, plainOptions, list, itemName}) => {
  useEffect(() => {
    dispatch({
      type: 'global/save',
      payload: {
        plainOptions: itemName && typeof itemName === "string"
          ? Object.values(list).map((item: any) => item[itemName])
          : Object.values(list).map((item: any) => {
            let temp = {};
            (itemName as string[]).map(i => {
              temp[i] = item[i]
            })
            return temp
          })
      }
    })
  }, [list])
  // 全选逻辑
  useEffect(() => {
    if (plainOptions.length === checkedList.length) {
      dispatch({
        type: 'global/save',
        payload: {
          indeterminate: false,
          checkAll: true
        }
      })
    } else {
      dispatch({
        type: 'global/save',
        payload: {
          indeterminate: true,
          checkAll: false
        }
      })
    }
  }, [checkedList, plainOptions])
  // 批量下载
  const onCheckAllChange = e => {
    dispatch({
      type: 'global/save',
      payload: {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      }
    })
  };
  return <Checkbox
    indeterminate={indeterminate}
    onChange={onCheckAllChange}
    checked={checkAll}>
    选择
  </Checkbox>
}

export default connect(({ global }) => ({
  checkedList: global.checkedList,
  indeterminate: global.indeterminate,
  checkAll: global.checkAll,
  plainOptions: global.plainOptions,
}))(CheckedAllButton)


