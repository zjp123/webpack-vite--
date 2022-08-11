import React, {useEffect, useState} from "react";
import {connect} from "dva";
import {Button, Card, Col, Divider, Form, Row} from "antd";
import {Images, InfoCard, TableView} from "@/components";
// import {informaTion} from "@/pages/Electronic/information/columns";
import IndoemrionModal from "@/pages/Electronic/information/indoemrionModal";
import {getPagation, goto} from "@/utils";
import replacementPic from "@/components/Replacement";
import {COMPARISON_RESULTS} from "@/utils/constants";
import {batchDownload} from "@/api/electronic";

const InformationPage = ({match, dispatch, isCoachModalVisible, searchFlowForm, flowList, userInfo}) => {
  const [form] = Form.useForm()
  const {fileNum, personId} = match.params
  const [loading, setLoading] = useState(false)

  const nextStage = (record) => {
    const {stage} = record
    switch (stage) {
      case '未受理':
        return '受理'
      case '受理':
        return '档案复核'
      case '档案复核':
        return '制证'
      case '制证':
        return '归档'
      case '归档' || '办结':
        return ''
      default:
        return ''
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => {
        // return <span>{(searGetanquanyuanForm.pageNum - 1) * searGetanquanyuanForm.pageSize + index + 1}</span>
        return <span>{index + 1}</span>
      },
    },
    {
      title: '档案状态',
      dataIndex: 'archivesStatus',
      width: 60,
      render: text => text === '正常' ? <span style={{color: 'green'}}>正常</span> : <span style={{color: 'red'}}>异常</span>
    },
    {
      title: '流水号',
      width: 90,
      dataIndex: 'serialNum',
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      width: 60,
    },
    {
      title: '准驾车型',
      dataIndex: 'perdritype',
      width: 60
    },
    {
      title: '驾培学校',
      dataIndex: 'schName',
      width: 120,
    },
    {
      title: '发证机关',
      dataIndex: 'issuingAuthority',
      width: 60
    },
    {
      title: '业务状态',
      dataIndex: 'stage',
      width: 60,
    },
    {
      title: '业务起止日期',
      width: 120,
      render: (text, record) => {
        return <span>{record.businessBeginTime ? record.businessBeginTime.split(" ")[0] : '- -'} 至 {record.businessEndTime ? record.businessEndTime.split(" ")[0] : '- -'}</span>
      }
    },
    {
      title: '操作',
      width: 180,
      render: (text, record) => {
        return <>
          {nextStage(record) && <Button
            type='link'
            onClick={() => {
              window.open('http://10.56.83.126:8008/view/frm/html/index.html')
            }}
          >
            {nextStage(record)}
          </Button>}
          <Button
            type='link'
            onClick={() => {
              goto.push("/electronic/information/checkInforMationPage/"
                + (record.serialNum || ' ') + "/"
                + record.stageCode + "/"
                + record.studentId + '/'
                + (fileNum || '-') + "/"
                + (personId || ' '))
            }
            }
          >
            查看详情
          </Button>
          <Button
            type='link'
            onClick={() => {
              batchDownload({idList: [record.studentId], idType: "studentId"})
            }
            }
          >
            下载
          </Button>
        </>
      }
    }
  ]

  const informaTion = [
    {
      title: '考生姓名',
      dataIndex: 'name'
    },
    {
      title: '身份证号码',
      dataIndex: 'idCard'
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone'
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      render: text => text && text.split(" ")[0]
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
    },
    {
      title: '移动电话',
      dataIndex: 'mobilePhone'
    },
    {
      title: '居住证编号',
      dataIndex: 'proofTemporaryResidence',
    },
    {
      title: '邮政编码',
      dataIndex: 'postCode',
    },
    {
      title: '电子邮箱',
      dataIndex: 'eMail',
    },
    {
      title: '准驾车型',
      dataIndex: 'perdritype',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
    },
    {
      title: '登记住所行政区划',
      dataIndex: 'registerResidence',
    },
    {
      title: '登记住所详细地址',
      dataIndex: 'registerAddress'
    },
    {
      title: '联系住所详细地址',
      dataIndex: 'contactAddress',

    },
    {
      title: '联系住所行政区划',
      dataIndex: 'contactResidence',

    },
  ];
  useEffect(() => {
    getInfo()
    return function cleanup() {
      dispatch({
        type: 'information/save',
        payload: {
          isShowInformation: false,
          userInfo: {}
        }
      })
    }
  }, [])
  useEffect(() => {
    if (userInfo.idCard) {
      getData()
    }
  }, [userInfo])
  const getInfo = async () => {
    await dispatch({
      type: 'information/loadModification',
      payload: {personId}
    })
  }
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'information/loadFlowList',
      payload: {
        ...searchFlowForm,
        idCard: userInfo?.idCard
      }
    })
    setLoading(false)
  }
  return (
    <Card>
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Row style={{display: "flex", justifyContent: "space-between"}} align="middle">
          <Col span={24} style={{display: "flex", margin: "10px", justifyContent: "space-between"}}>
            <h3>
              {/*<span>机动车驾驶人基本信息</span>*/}
              <span>档案编号:{fileNum || ' - -'} </span>
            </h3>
            <div>
              <Button
                size="small"
                style={{margin: "4px"}}
                onClick={() => {
                  dispatch({
                    type: "information/save",
                    payload: {
                      isCoachModalVisible: true
                    }
                  })
                }}
                type="primary"
                className="mar-l-4"
              >
                编辑基本信息
              </Button>
              <Button
                size="small"
                style={{margin: "4px"}}
                onClick={() => {
                  goto.push('/electronic/information')
                }}
              >
                返回
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="info-detail" style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
            <div className="p-cuts" />
            <InfoCard style={{width: "100%"}} columns={informaTion} data={userInfo} />
          </Col>
        </Row>
      </Form>
      <h4 style={{padding: '20px 0 0 12px', margin: 0, marginBottom: '1px', textAlign: 'left'}}>业务流水信息</h4>
      <Divider/>
      <TableView
        style={{flex: 1}}
        showTitle={false}
        hasPagination={false}
        dataSource={flowList}
        columns={columns as any}
        rowKey="id"
        getSelection={getSelection}
        loading={loading}
      />
      {isCoachModalVisible && <IndoemrionModal personId={personId} info={userInfo}/>}
    </Card>
  )
}

export default connect(({information, global}) => ({
  isShowInformation: information.isShowInformation,
  searchFlowForm: information.searchFlowForm,
  params: information.params,
  userInfo: information.userInfo,
  flowList: information.flowList,
  bizTypeList: global.bizTypeList,
  isCoachModalVisible: information.isCoachModalVisible
}))(InformationPage)

