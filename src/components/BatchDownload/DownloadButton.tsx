import React, {FC, useEffect} from "react";
import {Button} from "antd";
import { connect } from "dva"
import load2 from "@/assets/svg/icon-download2.svg"
import download from "@/assets/svg/icon-download.svg"

interface Props {
  downloadApi?: Function,
  paramsName: string
  params?: object,
  checkedList?: any[],
  xlsOrZip?: boolean
  onClick?: (checkedList) => void
  dispatch?: any
}

const DownloadButton: FC<Props> = (props) => {
  const {checkedList, downloadApi, paramsName, params, xlsOrZip, onClick, dispatch} = props
  const cleanUp = () => {
    dispatch({
      type: "global/save",
      payload: {
        checkedList: [],
        checkAll: false,
        indeterminate: true,
        plainOptions: [],
      }
    })
  }
  const defaultOnClick = async () => {
    await downloadApi({[paramsName]: checkedList, ...params}, !xlsOrZip ? '.zip' : (checkedList.length === 1) ? '' : 'zip')
    cleanUp()
  }
  return (
    <Button
      type="primary"
      disabled={!Boolean(checkedList.length)}
      onClick={onClick ? () => {
        onClick(checkedList)
        cleanUp()
      } : defaultOnClick}
    >
      {/* <img style={{ margin: 0 }} src={!Boolean(checkedList.length) ? require("@/assets/svg/icon-download2.svg") : require("@/assets/svg/icon-download.svg")} alt="" /> */}
      <img style={{ margin: 0 }} src={!Boolean(checkedList.length) ?  load2 : download} alt="" />
      {props.children}
    </Button>
  )
}

DownloadButton.defaultProps = {
  downloadApi: () => {}
}

export default connect(({ global }) => ({
  checkedList: global.checkedList,
}))(DownloadButton)
