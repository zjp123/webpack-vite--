import React, {useEffect, useState} from 'react'
import {Button, Modal, message, Card, Image, Spin} from 'antd'
import {connect} from 'dva'
import {InfoCard, Images} from '@/components'
import {through} from '@/api/faceRecognition'
import { createHashHistory } from 'history'
import './style.less'
import { store } from "@/store"
const { storeData = {} } = store.getState()
const { fileDomainUrl } = storeData

// const history = useHistory()
// const {Item} = Form
const history = createHashHistory()
const Confirm = Modal.confirm
const Comparison = ({dispatch, detailsInfo, match}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [])
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'comparison/details',
      payload: {id: match.params.id}
    })
    setLoading(false)
  }
  // 使用方法
  const infoCardColumns = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '性别',
      dataIndex: 'sex'
    },
    {
      title: '身份证号码',
      dataIndex: 'idCard'
    },
    {
      title: '驾校名称',
      dataIndex: 'schShortName'
    },
    {
      title: '业务类型',
      dataIndex: 'bizType'
    },
    {
      title: '准驾车型',
      dataIndex: 'carType'
    },
    {
      title: '流水号',
      dataIndex: 'serialNum'
    }
  ]
  const infoCardColumns1 = [
    {
      title: '考场',
      dataIndex: 'examSite'
    },
    {
      title: '自动比对结果',
      dataIndex: 'autoCompareResult'
    },
    {
      title: '人工比对结果',
      dataIndex: 'manualCompareResult'
    },
    {
      title: '科目',
      dataIndex: 'course'
    },
    {
      title: '自动比对时间',
      dataIndex: 'autoCompareTime'
    },
    {
      title: '人工比对时间',
      dataIndex: 'manualCompareTime'
    },
    {
      title: '人工比对人',
      dataIndex: 'manualOptorName'
    }
  ]
  return (
    <Spin spinning={loading}>
      <Card className='person-card' style={{overflow: 'scroll'}}>
        <div style={{position: 'relative'}}></div>
        <div className='person-info'>
          <p>个人信息</p>
          <Button type='primary' style={{marginBottom: '5px'}} onClick={() => {
            history.goBack()
          }}>返回</Button>
        </div>
        <InfoCard columns={infoCardColumns} data={detailsInfo} title="考生基本信息"/>
      </Card>
      <div className="mt24"></div>
      <Card style={{overflow: 'scroll'}}>
        <InfoCard columns={infoCardColumns1} data={detailsInfo} title="人像比对信息"/>
        <div className="mt24"></div>
        <h3>人像信息</h3>
        <div className="poto">
          <div className="flex-center-column">
            <Images
              src={detailsInfo.currectPic || require('@/components/Images/fallback.png')}
              width={260}
              height={200}
            />
            <p style={{marginTop: '20px'}}>历史照片</p>
          </div>
          <div className="flex-center-column">
            <Images
              src={detailsInfo.historyPic || require('@/components/Images/fallback.png')}
              width={260}
              height={200}
            />
            <p style={{marginTop: '20px'}}>现场照片</p>
          </div>

        </div>
        {
          (detailsInfo.autoCompareResult === '通过' || detailsInfo.manualCompareResult === '通过') ? null :
          <div className="poto2">
              <Button
                type="primary"
                className="pass-btn"
                onClick={() => {
                  Confirm({
                    title: '您确认通过该学员的人像信息吗',
                    cancelText: '取消',
                    okText: '确认',
                    onOk: () => {
                      // 0-不通过 1-通过
                      through({
                        id: match.params.id,
                        manualResult: 1
                      }).then(({code, msg}) => {
                        if (code === 0) {
                          message.success('操作成功(已通过)')
                          getData()
                        } else {
                          message.warn(msg)
                        }
                      })
                    }
                  })
                }}
              >
                通过
              </Button>
              <Button
                type="primary"
                className="refuse-btn"
                onClick={() => {
                  Confirm({
                    title: '您确认不予通过该学员的人像信息吗',
                    onOk: () => {
                      // 0-不通过 1-通过
                      through({
                        id: match.params.id,
                        manualResult: 0
                      }).then(({code, msg}) => {
                        if (code === 0) {
                          message.success('操作成功 (未通过)')
                          getData()
                        } else {
                          message.warn(msg)
                        }
                      })
                    }
                  })
                }}
              >
                不予通过
              </Button>
          </div>
        }
        {/* {detailsInfo.autoCompareResult === '未通过' && (
          <Col>
            {detailsInfo.manualCompareResult === '通过' && (
              <Item style={{textAlign: 'right'}}>
                <Space style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <Button
                    type="primary"
                    className="pass-btn"
                    onClick={() => {
                      Confirm({
                        title: '您确认通过该学员的人像信息吗',
                        cancelText: '取消',
                        okText: '确认',
                        onOk: () => {
                          // 0-不通过 1-通过
                          through({
                            id: match.params.id,
                            manualResult: 1
                          }).then(({code, msg}) => {
                            if (code === 0) {
                              message.success('操作成功(已通过)')
                              getData()
                            } else {
                              message.warn(msg)
                            }
                          })
                        }
                      })
                    }}
                  >
                    通过
                  </Button>
                  <Button
                    type="primary"
                    className="refuse-btn"
                    onClick={() => {
                      Confirm({
                        title: '您确认不予通过该学员的人像信息吗',
                        onOk: () => {
                          // 0-不通过 1-通过
                          through({
                            id: match.params.id,
                            manualResult: 1
                          }).then(({code, msg}) => {
                            if (code === 0) {
                              message.success('操作成功 (未通过)')
                              getData()
                            } else {
                              message.warn(msg)
                            }
                          })
                        }
                      })
                    }}
                  >
                    不予通过
                  </Button>
                </Space>
              </Item>
            )}
          </Col>
        )} */}
      </Card>
    </Spin>
  )
}
export default connect(({comparison, global}) => ({
  detailsInfo: comparison.detailsInfo,
  fileDomainUrl: global.fileDomainUrl
}))(Comparison)
