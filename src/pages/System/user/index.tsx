import React, {useEffect, useState} from "react"
import {connect} from "dva"
import {TableView, WhiteCard, SearchForm, Images} from "@/components"
import {Button, Form, message, Input, Modal, Switch, Space, Tag} from "antd"
import {getPagation} from "@/utils"
import {changeStatusUser} from "@/api/system"
import CuUserModal from "./cuUserModal"
import ExtendwordModal from "./ExtendwordModal"
import {deblockingAccountApi, prolongUserLifeApi, resetPwd} from "@/api/common"
import {STATE} from "./model"
import {openNotification} from "@/components/OpenNotification"
import replacementPic from "@/components/Replacement"
import {STATUS_STRING} from '@/utils/constants'
import SixInOneModal from "./sixInOneModal"
import bejtu from '@/assets/img/bejtu.png'

const Confirm = Modal.confirm
const {Item} = Form
const User = ({dispatch, userList, searchUserForm, isCuUserModalVisible, isExtendwordlVisible, isSixInOneVisible, addOrUpdate}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(0)
  const [userName,] = useState("")
  useEffect(() => {
    dispatch({
      type: "user/save",
      payload: {
        searchUserForm: {...STATE.searchUserForm}
      }
    })
    getData()
  }, [])
  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "user/save",
      payload: {
        searchUserForm: {...searchUserForm, pageNum, pageSize}
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "user/loadUserList"
    })
    setLoading(false)
  }
  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[{
          key: "userName",
          component: <Input maxLength={20} placeholder="请输入账号" key="userName"/>
        }, {
          key: "phonenumber",
          component: <Input maxLength={20} placeholder="请输入手机号" key="phonenumber"/>
        }, {
          key: "name",
          component: <Input maxLength={20} placeholder="请输入姓名" key="name"/>
        }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "user/save",
                  payload: {
                    searchUserForm: STATE.searchUserForm
                  }
                })
                getData()
              }}
            >重置</Button>
            <Button
              type='primary'
              onClick={() => {
                setUserId(0)
                dispatch({
                  type: "user/save",
                  payload: {
                    isCuUserModalVisible: true
                  }
                })
              }}>
              新增
            </Button>
          </Space>
        }
        handleSearch={(e) => {
          dispatch({
            type: "user/save",
            payload: {
              searchUserForm: {...searchUserForm, pageNum: 1, ...e}
            }
          })
          getData()
        }}
      >
      </SearchForm>
    )
  }
  const switchChange = (checked, userId) => {
    changeStatusUser({
      status: +checked ? "0" : "1",
      userId
    }).then((res) => {
      if (res.code === 0) {
        message.success(+checked ? "已启用" : "已禁用")
        getData()
      }
    })
  }

  const clearUserId = () => setUserId(0)

  //table表头
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchUserForm.pageNum - 1) * searchUserForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "证件照",
      width: 80,
      dataIndex: "avatar",
      render: text => {
        return text ? replacementPic(text, <Images width={30} height={40} src={text}/>, {}) :
          <img src={bejtu} style={{marginRight: 0, width: "30px", height: `40px`}} alt=""/>
      }
    },
    {
      title: "账号",
      dataIndex: "userName",
      width: 100
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 100
    },
    {
      title: "身份证明号码",
      dataIndex: "encryptedId",
      width: 140
    },
    {
      title: "角色",
      dataIndex: "userGroup",
      width: 100
    },
    {
      title: "数据权限",
      dataIndex: "dataConstraint",
      width: 100
    },
    {
      title: "所属部门",
      dataIndex: "deptName",
      width: 100
    },
    // {
    //   title: "手机号",
    //   dataIndex: "phonenumber",
    //   width: 120
    // },

    // {
    //   title: "状态",
    //   dataIndex: "status",
    //   width: 80,
    //   render: (text: string, record: Result.ObjectType) => {
    //     return <Switch
    //       checked={!(!!(Number(text)))}
    //       onChange={(checked) => switchChange(checked, record.userId)}
    //     />
    //   }
    // },
    {
      title: "账号状态",
      dataIndex: "status",
      width: 80,
      render: (text) => {
        const ITEM = STATUS_STRING.find(({value}) => value === text);
        if (!ITEM) {
          return '-';
        }
        return <Tag color={ITEM.color}>{ITEM.used_label}</Tag>;
      }
    },
    {
      title: "状态说明",
      dataIndex: "remark",
      width: 120
    },
    {
      title: "操作",
      width: 360,
      fixed: "right",
      render: (text, record) => {
        const associationStatus = record.associationStatus;
        return (
          <>
            <Button type='link' onClick={() => {
              ;(async () => {
                Confirm({
                  title: (+record.status ? '启用' : '禁用') + '账号',
                  content: <p>确认{(+record.status ? '启用' : '禁用')}<span
                    style={{fontSize: '16px', fontWeight: 600, margin: '0 5px'}}>{record.userName}</span>账号?</p>,
                  centered: true,
                  onOk: () => {
                    switchChange(+record.status, record.userId)
                  }
                });

                // let res: any = await checkAccountStatus({ userId: record.userId })
                // if (res.code === 0) {
                //   if (res.data.accountSystemBanStatus === 1) {
                //     //接口文案提示
                //     Confirm({
                //       title: (+record.status ? '启用' : '禁用') + '账号',
                //       content: <p>账号已被系统封禁,是否继续进行手动封禁</p>,
                //       centered: true,
                //       onOk: () => {
                //         switchChange(+record.status, record.userId)
                //       }
                //     });
                //   } else if (res.data.accountSystemBanStatus === 0) {
                //     //调接口
                //   }
                // }

              })()
            }}>{+record.status ? '启用' : '禁用'}账号</Button>
            <span className='tiny-delimiter'>|</span>
            <Button type='link' onClick={() => {
              Confirm({
                title: "重置密码",
                content: "确认重置密码为123456?",
                onOk: () => {
                  resetPwd({
                    userId: record.userId
                  }).then((res) => {
                    if (res.code === 0) {
                      message.success("重置密码成功为123456")
                    }
                  })
                }
              })
            }}>重置密码</Button>
            {/* <span className='tiny-delimiter'>|</span>
            <Button type='link' onClick={() => {
              Confirm({
                title: "解封账号",
                content: `是否解封 ${record?.userName} 账号`,
                onOk: () => {
                  deblockingAccountApi({ userName: record?.userName }).then((res) => {
                    if (res?.code === 0) {
                      openNotification({ message: res?.msg }, "success")
                    }
                  })
                }
              })
            }}>解封账号</Button> */}
            {
              record.admin ? null : <React.Fragment>
                <span className='tiny-delimiter'>|</span>
                <Button type='link' onClick={() => {
                  setUserId(record.userId)
                  dispatch({
                    type: "user/save",
                    payload: {
                      isCuUserModalVisible: true
                    }
                  })
                }}>编辑</Button>
                <span className='tiny-delimiter'>|</span>
                <Button type='link' onClick={() => {
                  Confirm({
                    title: "删除",
                    content: "确认删除?",
                    centered: true,
                    onOk: () => {
                      dispatch({
                        type: "user/deleteUser",
                        payload: {
                          userIds: [text.userId]
                        }
                      })
                    }
                  })
                }}>删除</Button>
                <span className='tiny-delimiter'>|</span>
                <Button type='link' onClick={() => {
                  Confirm({
                    title: "延长用户有效期",
                    content: `是否延长 ${record?.userName} 用户有效期`,
                    onOk: () => {
                      prolongUserLifeApi({userId: record?.userId}).then((res) => {
                        if (res?.code === 0) {
                          openNotification({message: res?.msg}, "success")
                        }
                      })
                    }
                  })

                }}>延长有效期</Button>
                <Button type='link' onClick={() => {
                  setUserId(record.userId)
                  dispatch({
                    type: "user/save",
                    payload: {
                      isSixInOneVisible: true,
                      associationStatus
                    }
                  })
                }}>
                  {associationStatus === 1 ? '关联账号' : '取消关联'}
                </Button>
              </React.Fragment>
            }
          </>
        )
      }
    }
  ]
  return (
    <WhiteCard>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchUserForm)
        }}
        showTitle={false}
        dataSource={userList}
        columns={columns as any}
        search={searchForm()}
        rowKey="userId"
        loading={loading}
      />
      {isCuUserModalVisible && <CuUserModal userId={userId} parentForm={form}/>}
      {isExtendwordlVisible && <ExtendwordModal userName={userName} userId={userId}/>}
      {isSixInOneVisible && <SixInOneModal userId={userId} clearUserId={clearUserId}/>}
    </WhiteCard>
  )
}
export default connect(({user}) => ({
  userList: user.userList,
  searchUserForm: user.searchUserForm,
  isCuUserModalVisible: user.isCuUserModalVisible,
  isExtendwordlVisible: user.isExtendwordlVisible,
  isSixInOneVisible: user.isSixInOneVisible,
  associationStatus: user.associationStatus,
}))(User)


