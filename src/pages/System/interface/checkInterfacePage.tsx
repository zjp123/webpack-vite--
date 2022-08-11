import React, { useState, useEffect } from 'react'
import { Modal,  } from 'antd'
import { connect } from 'dva';
import { interfaceListInfo } from '@/api/system'
import {InfoCard, WhiteCard} from "@/components";

interface CheckInterfacePageProps {
  id?: number,
  dispatch: Function,
}
const CheckInterfacePage: React.FC<CheckInterfacePageProps> = (props) => {
  const { id, dispatch } = props
  const [interfaceData,setInterfaceData] = useState({})
  //详情接口
  useEffect(() => {
    if (id) {
      ; (async () => {
        let res: any = await interfaceListInfo({ id })
        if (res.code === 0) {
          let status = ""
          if(res.data.status === 0){
            status = "正常"
          } else if(res.data.status === 1){
            status = "删除"
          } else if(res.data.status === 2) {
            status = "禁用"
          }
          setInterfaceData({
            ...res.data,
            status
          })
        }
      })()
    } else {
    }
  }, [])

  const columns = [
    {
      title: '配置状态',
      dataIndex: 'status',
      required: true
    },
    {
      title: '配置名称',
      dataIndex: 'name',
      required: true
    },
    {
      title: '接口类型',
      dataIndex: 'type',
      required: true,
    },
    {
      title: '准入ip',
      dataIndex: 'authIp',
      required: true,
    },
    {
      title: '端口号',
      dataIndex: 'serviceIp',
      required: true,
    },
    {
      title: '业务服务Service',
      dataIndex: 'serviceUrl',
      required: true,
    },
    {
      title: '业务服务系统接口类别',
      dataIndex: 'serviceSystemType',
      required: true,
    },
    {
      title: '业务服务接口序列号',
      dataIndex: 'serviceInterfaceSerialno',
      required: true,
    },
    {
      title: '业务服务场景编号',
      dataIndex: 'serviceSceneNo',
      required: true,
    },
    {
      title: '业务服务单位机构代码',
      dataIndex: 'serviceOfficeCode',
      required: true,
    },
    {
      title: '业务服务单位机构名称',
      dataIndex: 'serviceOfficeName',
      required: true,
    },
    {
      title: '业务服务用户标识',
      dataIndex: 'serviceUserCode',
      required: true,
    },
    {
      title: '业务服务用户姓名',
      dataIndex: 'serviceUserName',
      required: true,
    },
    {
      title: '业务服务终端标识',
      dataIndex: 'serviceTerminalMark',
      required: true,
    },
  ];
  return (
    <Modal
      title={'接口详情'}
      visible={true}
      width={1000}
      confirmLoading={false}
      onOk={() => {
        dispatch({
          type: 'interfaceManagement/save',
          payload: {
            isInterfacePageVisible: false
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'interfaceManagement/save',
          payload: {
            isInterfacePageVisible: false
          }
        })
      }}
    >
      <WhiteCard style={{width:"100%"}}>
        <InfoCard columns={columns} data={interfaceData} column={3} size={'small'} />
      </WhiteCard>
    </Modal>
  )
}
export default connect(({ interfaceManagement }) => ({
  interfaceList:interfaceManagement.interfaceList,
  isInterfacePageVisible:interfaceManagement.isInterfacePageVisible
}))(CheckInterfacePage)


