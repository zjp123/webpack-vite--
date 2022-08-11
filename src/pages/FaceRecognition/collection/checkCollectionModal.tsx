import React, {Fragment} from 'react'
import {Modal} from 'antd'
import {connect} from 'dva'
import {Images} from '@/components'
import './style.less'
import {isObject} from "@/utils/isType";
import replaceImg from "@/assets/img/bejtu.png"
import replacementPic from "@/components/Replacement";

interface checkCollectionModalProps {
  id?: number
  type?: number
  name?: string
  currentColumn?: any
  isCheckCollectionModalVisible: boolean
  dispatch: Function
}

// 查看照片类型
const PHOTO_TYPE = {
  18: '证件照片',
  12: '体检照片',
  15: '入场采集照片',
  16: '考中照片采集',
  17: '签字确认照片',
  10: '所有照片',
}

const CheckCollectionModal: React.FC<checkCollectionModalProps> = props => {
  const {dispatch, currentColumn: {name, type, imgList}} = props

  // 单个查看照片
  const renderSinglePic = () => {
    return (
      <div className="album_container_single">
        {imgList?.map((item, index) => {
          return (
            <div className="album" key={index}>
              <div className="pic">
                {replacementPic(item?.picUrl, <Images width={180} height={200} src={item?.picUrl}/>, {rawUrl: replaceImg})}
              </div>
              <div className="time">
                {item?.createTime}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 查看所有照片
  const renderAllPic = () => {
    return (<div className="album_container_all">
      <div className="license_pic">
        {(imgList?.license && imgList?.license.length !== 0) ? <div className="title_desc">证件照片</div> : ""}
        <div className="pic_container">
          {imgList?.license?.map((item, index) => {
            return (
              <div className="album" key={index}>
                <div className="pic">
                  {replacementPic(item?.picUrl, <Images width={180} height={200} src={item?.picUrl}/>, {rawUrl: replaceImg})}
                </div>
                <div className="time">
                  {item?.createTime}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="health_pic">
        {(imgList?.health && imgList?.health.length !== 0) ? <div className="title_desc">体检照片</div> : ""}
        <div className="pic_container">
          {imgList?.health?.map((item, index) => {
            return (
              <div className="album" key={index}>
                <div className="pic">
                  {replacementPic(item?.picUrl, <Images width={180} height={200} src={item?.picUrl}/>, {rawUrl: replaceImg})}
                </div>
                <div className="time">
                  {item?.createTime}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="before_pic">
        {(imgList?.before && imgList?.before.length !== 0) ? <div className="title_desc">入场照片</div> : ""}
        <div className="pic_container">
          {imgList?.before?.map((item, index) => {
            return (
              <div className="album" key={index}>
                <div className="pic">
                  {replacementPic(item?.picUrl, <Images width={180} height={200} src={item?.picUrl}/>, {rawUrl: replaceImg})}
                </div>
                <div className="time">
                  {item?.createTime}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="middle_pic">
        {(imgList?.middle && imgList?.middle.length !== 0) ? <div className="title_desc">考中照片</div> : ""}
        <div className="pic_container">
          {imgList?.middle?.map((item, index) => {
            return (
              <div className="album" key={index}>
                <div className="pic">
                  {replacementPic(item?.picUrl, <Images width={180} height={200} src={item?.picUrl}/>, {rawUrl: replaceImg})}
                </div>
                <div className="time">
                  {item?.createTime}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>)
  }

  return (
    <Modal
      title={`${name}-${PHOTO_TYPE[type]}`}
      visible={true}
      destroyOnClose
      footer={null}
      width={isObject(imgList) ? "80%" : imgList?.length > 2 ? "80%" : "40%"}
      onCancel={() => {
        dispatch({
          type: 'collection/save',
          payload: {
            isCheckCollectionModalVisible: false
          }
        })
      }}
    >
      {!isObject(imgList) ? renderSinglePic() : renderAllPic()}
    </Modal>
  )
}
export default connect(({collection}) => ({
  isCheckCollectionModalVisible: collection.isCheckCollectionModalVisible
}))(CheckCollectionModal)
