import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Input, message, Select, Divider } from 'antd'
import { connect } from 'dva'
import { upDateformation, getArchives, getInfoCollectionInfo } from '@/api/electronic'
import { WhiteCard, Upload, HighBeatMeter, InfoCard } from '@/components'
import { lnformaTion } from '../recording/columns'
import IndoemrionModal from './indoemrionModal'
import { deleteObjectEmptyKey } from '@/utils'
import { FORMITEM_LAYOUT_NOWRAP, archivesTypeObj } from '@/utils/constants'
import './style.less'
import { informaTion } from '@/pages/Electronic/information/columns'
const Recording = ({ dispatch, match, isCoachModalVisible, userInfo }) => {
  const [form] = Form.useForm()
  const [btnTit, setBtnTit] = useState('编辑基本信息')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [disable, setDisableg] = useState(true)
  const [idcardArray, setIdcardArray] = useState([])
  const [uploadUrl, setUploadUrl] = useState('')
  const [infoCardInfo, setInfoCardInfo] = useState({})
  const serialNum = match.params.id
  const studentId = match.params.studentId
  const totalAmount = match.params.totalAmount
  const archivesType = match.params.archivesType
  const personId = match.params.personId
  useEffect(() => {
    getData()
    getInfo()
  }, [])
  //获取列表数据
  const getData = async () => {
    await dispatch({
      type: 'recording/loadRecordingList',
      payload: { id: match.params.id }
    })
  }
  const getInfo = async () => {
    //获取详情
    //获取详情
    await dispatch({
      type: 'recording/loadModification',
      payload: { personId }
    })
    // getInfoCollectionInfo({studentId}).then((res) => {
    //   if (res.code === 0) {
    //     const obj = res.data
    //     const registrationTime = res.data.registrationTime
    //     const str = registrationTime && +registrationTime.substring(0, 4) + 3;
    //     const time = registrationTime ? registrationTime.substring(4, registrationTime.length) : '';
    //     setData(obj)
    //     setInfoCardInfo({
    //       ...obj,
    //       effectiveDate: registrationTime && registrationTime + '-' + (str + time)
    //     })
    //     // form.setFieldsValue({
    //     //   ...obj,
    //     //   effectiveDate: registrationTime && registrationTime + '-' + (str + time)
    //     // })
    //   }
    // })
  }
  const dealForm = (item: string, value: string | number) => {
    if (item === 'sex') {
      let sexs = ['男', '女']
      return sexs[value]
    }
    return value
  }
  const isIdcard = +archivesType === 1
  return (
    <WhiteCard
      title={
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} align="middle">
          <Col style={{ fontSize: '14px', color: 'red' }}>进入此页面请切换兼容模式,离开页面后请切换极速模式</Col>
        </Row>
      }
    >
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Row style={{ display: 'flex', justifyContent: 'space-between' }} align="middle">
          <Col style={{ width: '100%', display: 'flex', margin: '10px', justifyContent: 'space-between' }}>
            <h3>
              考生基本信息 流水号:{serialNum} <span style={{ color: 'red' }}>总欠费额:{totalAmount}0元</span>
            </h3>
            <div>
              <Button
                size="small"
                style={{ margin: '4px' }}
                onClick={() => {
                  setDisableg(!disable)
                  setBtnTit(!disable ? '编辑基本信息' : '编辑基本信息')
                  dispatch({
                    type: 'recording/save',
                    payload: {
                      isCoachModalVisible: true
                    }
                  })
                  if (!disable) {
                    form.validateFields().then(e => {
                      let postData = {
                        ...userInfo,
                        ...deleteObjectEmptyKey(e)
                      }
                      delete postData.studentInfoStatus
                    })
                  }
                }}
                type="primary"
                className="mar-l-4"
              >
                {btnTit}
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="info-detail" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            <div className="p-cuts" />
            <InfoCard style={{ width: '100%' }} columns={lnformaTion} data={userInfo} />
          </Col>
        </Row>
      </Form>
      <h3 style={{ paddingLeft: '20px' }}>请补录{archivesTypeObj[+archivesType]}</h3>
      <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'space-around', height: '300px' }}>
        <div style={{ width: isIdcard ? (window.innerWidth > 1200 ? '30%' : '45%') : window.innerWidth > 1200 ? '45%' : '55%', background: '#fafafa', height: '100%', flexShrink: 0 }}>
          <HighBeatMeter
            imgNumPage={isIdcard ? 2 : 1}
            getResult={res => {
              if (res) {
                if (isIdcard) {
                  let array = [
                    {
                      url: res[0],
                      type: 0
                    }
                  ]
                  if (res[1]) {
                    array.push({
                      url: res[1],
                      type: 1
                    })
                  }
                  setIdcardArray(array)
                } else {
                  setUploadUrl(res[0])
                }
              }
            }}
          />
        </div>
        <div style={{ width: isIdcard ? (window.innerWidth > 1200 ? '30%' : '20%') : window.innerWidth > 1200 ? '45%' : '40%', height: window.innerWidth > 1200 ? '100%' : isIdcard ? '50%' : '100%' }}>
          <Upload
            title={isIdcard ? '请上传身份证正面照' : ''}
            getUrl={url => {
              if (isIdcard) {
                let arr = idcardArray
                arr.push({
                  url,
                  type: 0
                })
                setIdcardArray(arr)
              } else {
                setUploadUrl(url)
              }
            }}
          />
        </div>
        {isIdcard ? (
          <div style={{ width: window.innerWidth > 1200 ? '30%' : '20%', height: window.innerWidth > 1200 ? '100%' : '50%' }}>
            <Upload
              title="请上传身份证反面照"
              getUrl={url => {
                let arr = idcardArray
                arr.push({
                  url,
                  type: 1
                })
                setIdcardArray(arr)
              }}
            />
          </div>
        ) : null}
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '20px' }}>
        <Button
          size="small"
          loading={loading}
          style={{ width: '300px', height: '44px', display: 'block' }}
          onClick={() => {
            if (isIdcard) {
              if (idcardArray.length < 2) {
                message.warn('请上传或拍照2张照片')
                return
              }
            } else {
              if (!uploadUrl) {
                message.warn('请上传图片或拍照')
                return
              }
            }
            setLoading(true)
            let files = []
            if (isIdcard) {
              files = idcardArray
            } else {
              if (uploadUrl) {
                files = [
                  {
                    url: uploadUrl
                  }
                ]
              } else {
                message.warn('请上传或拍照')
              }
            }
            getArchives({
              studentId,
              archivesType,
              files
            })
              .then(res => {
                if (res.code === 0) {
                  message.success('补录成功')
                }
                setLoading(false)
              })
              .catch(() => {
                setLoading(false)
              })
          }}
          type="primary"
          className="mar-l-4"
        >
          提交信息
        </Button>
      </div>
      {isCoachModalVisible && <IndoemrionModal info={userInfo} personId={personId} />}
    </WhiteCard>
  )
}
export default connect(({ recording }) => ({
  isCoachModalVisible: recording.isCoachModalVisible,
  userInfo: recording.userInfo
}))(Recording)
