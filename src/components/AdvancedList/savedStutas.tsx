import React, {FC, useState} from 'react'
import {ItemInterface} from '@/components/AdvancedList/itemInterface'
import {Button, Row, Col, Tooltip, Modal} from 'antd'
import UpOutlined from '@/assets/svg/upOutlined.svg'
import DownOutlined from '@/assets/svg/downOutlined.svg'
import {OmitString} from '@/components'

interface SavedStutas {
  formData: ItemInterface
  removeOneOfVirtualArchiveConfigList: any
  updateMyStatus: any
  dictTypes: any
}

const SavedStutas: FC<SavedStutas> = ({formData, removeOneOfVirtualArchiveConfigList, updateMyStatus, dictTypes}) => {
  const [uOrD, setuOrD] = React.useState('d')
  const isReuqired = (value): string | undefined => {
    switch (value) {
      case '0':
        return '否'
      case '1':
        return '是'
      default:
        return undefined
    }
  }

  const oulinedIconImg = value => {
    return <img onClick={() => setuOrD(uOrD === 'u' ? 'd' : 'u')} className="outlined-icon" width={60} src={value}
                alt=""/>
  }

  const factory = (value, typeList) => {
    if (value && value.length > 0 && typeof value === 'string') {
      return value
        .split(',')
        .map(item => typeList.find(i => i.code === item)?.label)
        .join(',')
    }
  }

  const OutlinedIcon = (): JSX.Element => {
    if (uOrD === 'u') {
      return oulinedIconImg(UpOutlined)
    }
    return oulinedIconImg(DownOutlined)
  }

  const DetailsItems = () => {
    return uOrD === 'd' ? (
      <OutlinedIcon/>
    ) : (
      <>
        {formData.details.map((item, index) => detailsItem(item, index))}
        <OutlinedIcon/>
      </>
    )
  }

  const detailsItem = (item, index) => {
    return (
      <div className="advance-saved-child" key={index}>
        <div className="advance-saved-child-content">
          <Row>
            <Col span={6}>
              <div className="advance-saved-child-item">档案名称：{OmitString(item.archiveName, 4, 20)}</div>
            </Col>
            <Col span={6}>
              <div className="advance-saved-child-item">是否必填：{isReuqired(item.isRequired)}</div>
            </Col>
            <Col span={6}>
              <div className="advance-saved-child-item">是否同步影像化：{isReuqired(item.isTransmission)}</div>
            </Col>
            <Col span={6}>
              <div className="advance-saved-child-item">所属阶段：{factory(item.stage, dictTypes.businessStatusList)}</div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  return (
    <div className="advance-saved">
      <div className="advance-saved-title">
        配置名称：{formData.name}
      </div>
      <div className="advance-saved-father">
        <div className="advance-saved-father-content">
          <div className="advance-saved-father-content-item">
            <p>准驾车型：{OmitString(formData.perdritype as string, 3, 10)}</p>
          </div>
          <div className="advance-saved-father-content-item">
            <p>业务总类：{OmitString(factory(formData.businessType, dictTypes.bizTypeList), 4, 20)}</p>
          </div>
          <div className="advance-saved-father-content-item">
            <p>业务分类：{OmitString(formData.businessDetailName, 4, 20)}</p>
          </div>
          <div className="advance-saved-father-content-item">
            <p>是否唯一：{OmitString(formData.onlyName, 4, 20)}</p>
          </div>
          <div className="advance-saved-father-content-item">
            <p>驾驶人来源：{OmitString(formData.sourceName, 3, 20)}</p>
          </div>
          <div className="advance-saved-father-content-item">
            <p>申请方式：{OmitString(factory(formData.way, dictTypes.student_wayList), 4, 20)}</p>
          </div>
        </div>
        <div className="advance-saved-father-button">
          <Button className="edit-or-save" onClick={updateMyStatus} type="primary">
            {formData.myStatus}
          </Button>
          <Button className="delete" onClick={() => {
            Modal.confirm({
              title: "删除",
              content: "确认删除?",
              centered: true,
              onOk: () => {
                removeOneOfVirtualArchiveConfigList()
              }
            })
          }}>
            删除
          </Button>
        </div>
      </div>
      <div
        className="advance-saved-children">{formData.details.length > 0 && formData.details.length <= 1 ? detailsItem(formData.details[0], 0) : <DetailsItems />}</div>
    </div>
  )
}

export default SavedStutas
