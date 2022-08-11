import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import './style.less'
import {TableView, WhiteCard, SearchForm, Images} from "@/components"
import {Button, Form, Input, Modal, Space, Select} from "antd"
import {getPagation} from "@/utils"
import {STATE} from "./model";
import {getDict} from "@/utils/publicFunc"
import CuDatabaseConfigModal from "./cuDatabaseConfigModal";
import {OmitString} from '@/components'

const Confirm = Modal.confirm;

const DatabaseConfig = ({dispatch, databaseConfigList, isCuDatabaseConfigModalVisible, databaseConfigSearchForm, databaseNameList}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDatabaseConfigList()
    getDict(dispatch, "databaseName")
    return function cleanup() {
      dispatch({
        type: "databaseConfig/save",
        payload: {
          barrierList: [],
          databaseConfigSearchForm: {
            pageNum: 1,
            pageSize: 10,
          },
        }
      })
    }
  }, [])

  const getDatabaseConfigList = async () => {
    setLoading(true)
    await dispatch({
      type: 'databaseConfig/loadDatabaseConfigList'
    })
    setLoading(false)
  }

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "databaseConfig/save",
      payload: {
        databaseConfigSearchForm: {...databaseConfigSearchForm, pageNum, pageSize}
      }
    })
    getDatabaseConfigList()
  }

  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[{
          key: "name",
          component: <Input placeholder="请输入数据库别名/名称" />
        }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "databaseConfig/save",
                  payload: {
                    databaseConfigSearchForm: STATE.databaseConfigSearchForm
                  }
                })
                getDatabaseConfigList()
              }}
            >重置</Button>
            <Button type='primary' onClick={() => {
              dispatch({
                type: 'databaseConfig/save',
                payload: {
                  isCuDatabaseConfigModalVisible: true,
                }
              })
            }}>
              增加
            </Button>
          </Space>
        }
        handleSearch={(e) => {
          dispatch({
            type: "databaseConfig/save",
            payload: {
              databaseConfigSearchForm: {...databaseConfigSearchForm, pageNum: 1, ...e}
            }
          })
          getDatabaseConfigList()
        }}
      >
      </SearchForm>
    )
  }

  //table表头
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(databaseConfigSearchForm.pageNum - 1) * databaseConfigSearchForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "数据库名称",
      dataIndex: "databaseName",
      width: 200
    },
    {
      title: "数据库连接别名",
      dataIndex: "name",
      width: 200
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 120,
      render: text => OmitString(text, 20, 25)
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: 120
    },
    {
      title: "密码",
      dataIndex: "password",
      width: 200
    },
    {
      title: "数据库驱动",
      dataIndex: "driverClassName",
      width: 100,
    },
    {
      title: "是否主库",
      dataIndex: "isMaster",
      width: 100,
      render: text => text === 1 ? '是' : text === 0 ? '否' : ''
    },
    {
      title: "创建人",
      dataIndex: "createdByName",
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "createdTime",
      width: 100,
    },
    {
      title: "操作",
      width: 160,
      fixed: "right",
      render: (text, record) => {
        const toStatus = record.status == 1 ? 0 : 1
        return (
          <>
            <Button type='link'
                    onClick={() => {
                      dispatch({
                        type: 'databaseConfig/save',
                        payload: {
                          isCuDatabaseConfigModalVisible: true,
                          id: record.id,
                        }
                      })
                    }}
            >
              修改
            </Button>
            <Button type='link'
                    onClick={async () => {
                      Confirm({
                        title: "删除设备",
                        content: <>确认删除 <b>{record.examSiteName}</b> 设备  ？删除后该设备将不能使用。</>,
                        centered: true,
                        onOk: async () => {
                          await dispatch({
                            type: 'databaseConfig/deleteDatabaseConfig',
                            payload: {
                              id: record.id,
                            }
                          })
                          getDatabaseConfigList()
                        }
                      })
                    }}
            >
              删除
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard>
      {isCuDatabaseConfigModalVisible && <CuDatabaseConfigModal/>}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(databaseConfigSearchForm)
        }}
        showTitle={false}
        dataSource={databaseConfigList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({databaseConfig, global}) => ({
  databaseConfigList: databaseConfig.databaseConfigList,
  databaseConfigSearchForm: databaseConfig.databaseConfigSearchForm,
  isCuDatabaseConfigModalVisible: databaseConfig.isCuDatabaseConfigModalVisible,
  databaseNameList: global.databaseNameList
}))(DatabaseConfig)


