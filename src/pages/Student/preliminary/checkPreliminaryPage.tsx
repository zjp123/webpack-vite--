import React, {useEffect, useState, useRef} from 'react'
import {Col, Form, Row, Tabs, Button, Modal, Radio, Input, message, Divider} from 'antd'
import {connect} from 'dva'
import {Application, SEX_NUMBER_ENUM, Signuptreview} from '@/utils/constants'
import {TableView, WhiteCard, InfoCard} from '@/components'
import {getprelInfo} from '@/api/student'
import {Images} from '@/components'
import {copy, getDict} from '@/utils/publicFunc'
import './style.less'
import {goto, moment2String} from "@/utils";
import copyIcon from "@/assets/svg/copy.svg"
import signatrueImg from "@/assets/img/signatrue.png";

const CheckSafetyoPage = ({dispatch, match, bizTypeList, fileDomainUrl}) => {
  const [form] = Form.useForm()
  const [getGauanInfo, setgetGauanInfo] = useState({})
  const [getGauanInfot, setgetGauanInfot] = useState({})
  const [pic, setPic] = useState({})
  const id = match?.params?.id
  const {serialNum, acceptStatus} = match.params
  const [isRegistrationAcceptance, setIsRegistrationAcceptance] = useState(false);
  const [copyContent, setCopyContent] = useState('身份证明号码')
  useEffect(() => {
    getInfo()
    getDict(dispatch, 'bizType')
    getDict(dispatch, 'bizType')
  }, [])

  const getInfo = () => {
    //获取详情
    if (id) {
      ;(async () => {
        let res: any = await getprelInfo({id})
        if (res.code === 0) {
          setPic({
            ...pic,
            photoUrl: res.data.photoUrl,
            healthUrl: res.data.healthUrl,
            singUpUrl: res.data.singUpUrl,
            idcardUrl: res.data.idcardUrl,
            livePhotoUrl: res.data.livePhotoUrl
          })
          setgetGauanInfo(res.data.signInfo || [])
          setgetGauanInfot(res.data.healthInfo || [])
        }
      })()
    } else {
      form.resetFields()
    }
  }
  console.log(getGauanInfo, getGauanInfot)
  const informaEion = [
    {
      title: "姓名",
      dataIndex: "name",
      render: (text) => {
        return <span>
          {text}
          <img onClick={() => copy(text)} style={{cursor: 'pointer', marginLeft: '6px'}} src={copyIcon} alt=""/>
        </span>
      }
    }, {
      title: "性别",
      dataIndex: "sex",
      render: (text) => {
        return SEX_NUMBER_ENUM.find((item) => item.value === text)?.label || ""
      }
    },
    {
      title: "出生日期",
      dataIndex: "birthday",
      render: (text) => {
        return moment2String(text, "YYYY-MM-DD")
      }
    },
    {
      title: "身份证号",
      dataIndex: "idcard",
      render: (text) => {
        return <span>
          {text}
          <img onClick={() => copy(text)} style={{cursor: 'pointer', marginLeft: '6px'}} src={copyIcon} alt=""/>
        </span>
      }
    },
    {
      title: "民族",
      dataIndex: "ethnic"
    },
    {
      title: "业务类型",
      dataIndex: "businessType",
      render: (text) => {
        const ITEM = bizTypeList.find(({value}) => value === text)
        if (!ITEM) {
          return '-'
        }
        return <span>{ITEM.label}</span>
      },
    },
    {
      title: "准驾车型",
      dataIndex: "perdritype"
    },
    {
      title: "联系方式",
      dataIndex: "mobilePhone"
    },
    {
      title: "报名时间",
      dataIndex: "registrationTime"
    },
    {
      title: "有效日期",
      dataIndex: "expirationDate"
    },
    {
      title: "所属驾校",
      dataIndex: "schName"
    },
    {
      title: "邮寄地址",
      dataIndex: "contactAddress"
    },
    {
      title: "登记住所",
      dataIndex: "registerResidence"
    },
    {
      title: "电子邮箱",
      dataIndex: "eMail"
    }
  ]
  return (
    <WhiteCard
      title={
        <Row style={{width: '100%', display: 'flex', justifyContent: 'space-between'}} align="middle">
          <Col style={{width: '100%', fontSize: '18px', margin: '0 10px', marginTop: '10px'}}>
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: "space-between"
            }}>
              <span>
                <span>流水号:{serialNum}</span>{
                acceptStatus === '0' ?
                  <span style={{
                    color: '#FF8D49',
                    fontSize: '18px',
                    fontWeight: 500,
                    marginLeft: '10px'
                  }}>未受理</span> :
                  <span style={{
                    color: '#00A70D',
                    fontSize: '18px',
                    fontWeight: 500,
                    marginLeft: '10px'
                  }}>已受理</span>
              }
              </span>
              <div>
                {
                  acceptStatus === '0' && <Button
                    style={{marginRight: '8px'}}
                    onClick={() => {
                      setIsRegistrationAcceptance(true)
                      copy(getGauanInfo['idcard'])
                      setCopyContent('身份证明号码')
                      window.open('http://10.56.83.126:8008/view/frm/html/index.html')
                    }
                    }
                    type='primary'>
                    受理
                  </Button>
                }
                <Button
                  onClick={() => {
                    goto.push('/student/preliminary')
                  }}
                  >
                  返回
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      }>
      <Modal
        title="复制信息"
        visible={isRegistrationAcceptance}
        width={376}
        onOk={() => setIsRegistrationAcceptance(false)}
        onCancel={() => setIsRegistrationAcceptance(false)}
        footer={null}
      >
        <div>
          <div style={{marginBottom: '12px', display: "flex", justifyContent: 'space-between'}}>
            <div
              style={{
                width: '240px',
                lineHeight: '32px',
                paddingLeft: '4px',
                border: '1px solid #D9D9D9',
              }}
            >{getGauanInfo['idcard']}</div>
            <Button onClick={() => {
              copy(getGauanInfo['idcard'])
              setCopyContent('身份证明号码')
            }}>复制</Button>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div
              style={{
                width: '240px',
                lineHeight: '32px',
                paddingLeft: '4px',
                border: '1px solid #D9D9D9',
              }}
            >{getGauanInfo['name']}</div>
            <Button onClick={() => {
              copy(getGauanInfo['name'])
              setCopyContent('姓名')
            }}>复制</Button>
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6B798E'
          }}>
            {copyContent}已复制到剪贴板
          </div>
        </div>
      </Modal>
      <div style={{padding: '0 12px'}}>
        <InfoCard column={3} columns={informaEion} data={getGauanInfo || []}/>
      </div>
      <div style={{width: '100%', height: '8px', marginTop: '12px', backgroundColor: '#f1f3f4'}} />
      <h3 style={{margin: "12px 20px 0", fontSize: '18px'}}>报名信息</h3>
      <Divider/>
      <div className="preliminary-box">
        <div className="preliminary-item">
          <div className="preliminary-item-title">证件照</div>
          <div className="preliminary-item-main">
            <Images width={200} src={pic['photoUrl']} alt=""/>
          </div>
        </div>
        <div className="preliminary-item">
          <div className="preliminary-item-title">身体条件证明</div>
          <div className="preliminary-item-main">
            <Images width={200} src={pic['healthUrl']} alt=""/>
          </div>
        </div>
        <div className="preliminary-item">
          <div className="preliminary-item-title">机动车驾驶证申请表</div>
          <div className="preliminary-item-main">
            <Images width={200} src={pic['singUpUrl']} alt=""/>
          </div>
        </div>
        <div className="preliminary-item">
          <div className="preliminary-item-title">申请人身份证明</div>
          <div className="preliminary-item-main">
            <Images width={200} src={pic['idcardUrl']} alt=""/>
          </div>
        </div>
        <div className="preliminary-item">
          <div className="preliminary-item-title">申请人现场照片</div>
          <div className="preliminary-item-main">
            <Images width={200} src={pic['livePhotoUrl']} alt=""/>
          </div>
        </div>
      </div>
    </WhiteCard>
  )
}
export default connect(({preliminary, global}) => ({
  preliList: preliminary.preliList,
  searchPreliminaryForm: preliminary.searchPreliminaryForm,
  bizTypeList: global.bizTypeList,
  ileDomainUrl: global.fileDomainUrl
}))(CheckSafetyoPage)
