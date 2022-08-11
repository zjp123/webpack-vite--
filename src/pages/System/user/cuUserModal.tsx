import React, { useState, useEffect } from "react"
import { Form, Input, Row, Col, Modal, TreeSelect, Select, Radio } from "antd"
import { FORMITEM_LAYOUT, TEL_REGEXP } from "@/utils/constants"
import { connect } from "dva"
import { getUserInfo } from "@/api/system"
import { rulesNumber, idCard } from "@/utils"
import { getDict } from "@/utils/publicFunc"
import { Upload } from '@/components'
import { openNotification } from "@/components/OpenNotification"
import './style.less'
const { TreeNode } = TreeSelect

interface cuUserModalProps {
  userId?: number,
  isCuUserModalVisible: boolean,
  dispatch: Function,
  treeSelectList: [],
  optionSelectList: any,
  schList: Array<any>
  parentForm: object
}

const CuUserModal: React.FC<cuUserModalProps> = (props) => {
  const { isCuUserModalVisible, userId, dispatch, treeSelectList, optionSelectList, schList, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [deptId, setDeptId] = useState("")
  const [policeOfficerMark, setPoliceOfficerMark] = useState(1)
  const [schoolInfoArray, setSchoolInfoArray] = useState([])
  const [userImage, setUserImage] = useState("")
  //详情接口
  useEffect(() => {
    dispatch({
      type: "global/treeSelectList"
    })
    dispatch({
      type: "global/getDrivingSchoolSelectList"
    })

    if (userId) {
      ; (async () => {
        let res: any = await getUserInfo({ userId })
        if (res.code === 0) {
          // let ipAddress = res.data.ipAddress && res.data.ipAddress.replace("[", "").replace("]", "")
          let str = res.data.deptId + "_" + res.data.deptName
          setDeptId(str)
          setPoliceOfficerMark(res.data.policeOfficerMark)
          setUserImage(res.data.avatar)
          form.setFieldsValue({
            ...res.data,
            // ipAddress,
            roleIds: res.roleIds[0] + "",
            deptId: res.data.deptName
          })
        }
      })()
    } else {
      form.resetFields()
    }
  }, [])

  //角色接口
  useEffect(() => {
    dispatch({
      type: "global/getOptionSelectList",
      payload: policeOfficerMark
    })
  }, [policeOfficerMark])

  const handleDrivingSchoolSearch = async (val) => {
    let reg = /^[\u4e00-\u9fa5]+$/g,
      flag = reg.test(val)
    if (flag) {
      getDict(dispatch, "sch", { keyword: val }).then((res => {
        setSchoolInfoArray(res)
      }))
    } else {
      setSchoolInfoArray([])
    }
  }

  // 生成子节点
  const getNode = (list) => {
    list = list || []
    return list.map((data) => {
      return (
        <TreeNode title={data.label} key={data.id} value={`${data.id}`}>
          {
            data.children && getNode(data.children)
          }
        </TreeNode>
      )
    })
  }
  const onChange = (value, res) => {
    let str = value + "_" + res[0]
    setDeptId(str)
    form.setFieldsValue({
      deptId: res[0]
    })
  }
  const phoneNumberPattern = (_, value) => {
    // console.log(value, _, 'kkkk')
    const reg = /(?=(^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$))|(?=^(\d{3,4}-)?(\d{7,8}$))/
      switch (true) {
        case (!value || !String(value).length):
            return Promise.resolve()
        case (String(value).length != 11):
            return Promise.reject('请输入正确的手机号')
        case (!reg.test(value)):
            return Promise.reject('请输入正确的手机号')
        default:
            return Promise.resolve()
      }
  }

  const userNamePattern = (_, value) => {
    // console.log(value, _, 'kkkk')
    // console.log(userId)
    const reg = /\w*?\d*\w*?/ig // 只能是数字字母组合
    const regHan = /[\u4e00-\u9fa5]/g
    if (regHan.test(value)) { // 包含中文了
      return Promise.reject('请输入正确账号')
    }
      switch (true) {
        // case (!value || !String(value).length):
        //     return Promise.reject('请输入正确账号')
        case (String(value).length > 30):
            return Promise.reject('请输入正确的账号')
        case (!reg.test(value)):
            return Promise.reject('请输入正确账号')
        default:
            return Promise.resolve()
      }
  }
  // const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  return (
    <Modal
      title={(userId ? "编辑" : "新增") + "账号"}
      visible={isCuUserModalVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            if (userId) {
              res.userId = userId
            }
            await dispatch({
              type: "user/addUser",
              payload: {
                parentForm,
                postData:{
                  ...res,
                  schoolId:res.schoolId===undefined?'':res.schoolId,
                  // ipAddress: `[${res.ipAddress.split(",")}]`,
                  deptId: deptId.split("_")[0],
                  roleIds: [res?.roleIds],
                  avatar: userImage
                }
              }
            })
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: "user/save",
          payload: {
            isCuUserModalVisible: false
          }
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
        initialValues={{
          password: "123456",
          policeOfficerMark: 1
        }}
        // labelCol={ { style: {width: '100px' } }}
        labelCol={{ style: { width: '100px' } }}
        // labelAlign='right'
      >
        <Row className="userRow">
          {/* <div style={{ display: 'flex', width: '78%', margin: '0 auto', justifyContent: 'space-between' }}> */}

              {/* <Col span={24} style={{display: 'flex', flexDirection: 'row'}}>
                <div className="col-left" style={{display: 'flex', flexDirection: 'column'}}>
                  <div>
                    <Form.Item
                        // extra='5-30位字符，以字母开头，只能包含英文字母、数字、下划线，账号创建成功后不允许修改'
                        // rules={[
                        //   { required: true, message: `最少5个字` },
                        //   {
                        //     validator: (rule, value, callback) => {
                        //       if (!value) {
                        //         callback()
                        //         return
                        //       }
                        //       if (value.length < 5) {
                        //         callback("最少5个字")
                        //       } else {
                        //         callback()
                        //       }
                        //     }
                        //   }
                        // ]}
                        rules={[
                          {
                            required: false,
                            message: "请输入正确的手机号",
                            validator: (rule, value) => userNamePattern(rule, value)
                          }
                        ]}
                        labelCol={{ style: { width: '100px' } }}
                        {...FORMITEM_LAYOUT} name="userName" label="账号"
                        validateTrigger={['onBlur', 'onChange']}
                    >
                      <Input placeholder="账号" type="text" disabled={!!userId} maxLength={30}/>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      labelCol={{ style: { width: '100px' } }}
                      rules={[
                        { required: true, message: `姓名只能用汉字`, pattern: /[\u4e00-\u9fa5]/ }
                      ]}
                      {...FORMITEM_LAYOUT} name="name" label="姓名"
                    >
                      <Input placeholder="请输入汉字 最长30位" type="text" maxLength={30} />
                    </Form.Item>
                  </div>
                </div>
                <div className="col-right">
                  <Upload title='本地上传头像' electronicSignImg={userImage} getUploadedRes={(res) => {
                    if (res?.code === 0) {
                      openNotification({ message: "图片上传成功" }, "success")
                      form.setFieldsValue({
                        photo: res?.data?.uri
                      })
                      setUserImage(res.data.uri)
                    } else {
                      form.setFieldsValue({
                        photo: ""
                      })
                      setUserImage("")
                      openNotification({ message: "图片上传失败" }, "error")
                    }
                  }} />
                </div>
              </Col> */}
          <div className="row-left" style={{width: '80%'}}>
            <Col span={24}>
              <Form.Item
                // extra='5-30位字符，以字母开头，只能包含英文字母、数字、下划线，账号创建成功后不允许修改'
                // rules={[
                //   { required: true, message: `最少5个字` },
                //   {
                //     validator: (rule, value, callback) => {
                //       if (!value) {
                //         callback()
                //         return
                //       }
                //       if (value.length < 5) {
                //         callback("最少5个字")
                //       } else {
                //         callback()
                //       }
                //     }
                //   }
                // ]}
                rules={[
                  {
                    required: true,
                    message: "请输入正确账号",
                    // validator: userId ? null : (rule, value) => userNamePattern(rule, value)
                    // validator: (rule, value) => userNamePattern(rule, value)
                  },
                  {
                    validator: (rule, value) => userNamePattern(rule, value)

                  }
                ]}
                {...FORMITEM_LAYOUT} name="userName" label="账号"
                validateTrigger={['onBlur', 'onChange']}
                labelCol={{ style: { width: '100px' } }}
              >
                <Input placeholder="账号" type="text" disabled={!!userId} maxLength={30}/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  { required: true, message: `姓名只能用汉字`, pattern: /[\u4e00-\u9fa5]/ }
                ]}
                {...FORMITEM_LAYOUT} name="name" label="姓名"
                labelCol={{ style: { width: '100px' } }}
              >
                <Input placeholder="请输入汉字 最长30位" type="text" maxLength={30} />
              </Form.Item>
            </Col>
            {
              userId ? null : <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "请填写密码"
                    }
                  ]}
                  {...FORMITEM_LAYOUT} name="password" label="密码"
                  labelCol={{ style: { width: '100px' } }}
                >
                  <Input placeholder="密码" disabled={true} />
                </Form.Item>
              </Col>
            }
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "请输入正确的手机号",
                    // validateTrigger: ['onChange', 'onFocus'],
                    validator: (rule, value) => phoneNumberPattern(rule, value)
                    // pattern: TEL_REGEXP
                  }
                ]}
                {...FORMITEM_LAYOUT} name="phonenumber"
                validateTrigger={['onBlur', 'onChange']}
                label="手机号"
                labelCol={{ style: { width: '100px' } }}

              >
                <Input placeholder="手机号" maxLength={11} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "请填写所属部门"
                  }
                ]}
                {...FORMITEM_LAYOUT} name="deptId"
                label="所属部门"
                labelCol={{ style: { width: '100px' } }}
              >
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  onChange={onChange}
                >
                  {
                    getNode(treeSelectList)
                  }
                </TreeSelect>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={rulesNumber(false)}
                {...FORMITEM_LAYOUT}
                name="examinerCode"
                label="考试员代码"
                labelCol={{ style: { width: '100px' } }}
              >
                <Input placeholder="请输入数字 最长30位" maxLength={30} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={idCard(true)}
                {...FORMITEM_LAYOUT}
                name="idNumber"
                label="身份证号码"
                labelCol={{ style: { width: '100px' } }}
              >
                <Input placeholder="身份证号码" maxLength={18} />
              </Form.Item>
            </Col>
            {/*<Col span={24}>*/}
            {/*  <Form.Item*/}
            {/*    extra='日期格式为yyyy-mm-dd,例如2021-01-01'*/}
            {/*    rules={dateRules(true)} {...FORMITEM_LAYOUT} name="effectiveDate" label="账号有效期">*/}
            {/*    <Input placeholder="账号有效期" maxLength={18}/>*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
            <Col span={24}>
              <Form.Item rules={[
                {
                  required: true,
                  message: "请选择角色类型"
                }
              ]}  {...FORMITEM_LAYOUT} name="policeOfficerMark" label="角色类型"
              labelCol={{ style: { width: '100px' } }}
              >
                <Radio.Group onChange={(e) => {
                  setPoliceOfficerMark(e.target.value)
                  form.setFieldsValue({
                    roleIds: undefined
                  })
                }}>
                  <Radio value={0} key={0}>警员</Radio>
                  <Radio value={1} key={1}>非警员</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item rules={[
                {
                  required: true,
                  message: "请填写角色"
                }
              ]} {...FORMITEM_LAYOUT} name="roleIds" label="角色"
              labelCol={{ style: { width: '100px' } }}
              >
                <Select placeholder="角色" allowClear>
                  {optionSelectList.map(({ roleId, roleName }) => {
                    return <Select.Option value={roleId} key={roleId}>{roleName}</Select.Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            {
              policeOfficerMark === 1 ? <Col span={24}>
                <Form.Item rules={[
                  {
                    required: false,
                    message: "请选择所属驾校"
                  }
                ]} {...FORMITEM_LAYOUT} name="schoolId" label="所属驾校"
                labelCol={{ style: { width: '100px' } }}
                >
                  {/*<Select*/}
                  {/*  showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="模糊搜索所属驾校"*/}
                  {/*  filterOption={handleFilterOption}*/}
                  {/*  onSearch={handleDrivingSchoolSearch}*/}
                  {/*>*/}
                  {/*  {schoolInfoArray?.map(({ code, name }) => {*/}
                  {/*    return <Select.Option value={code} key={code}>{name}</Select.Option>*/}
                  {/*  })}*/}
                  {/*</Select>*/}
                  <Select placeholder="所属驾校" allowClear>
                    {schList.map(({ code, name }) => {
                      return <Select.Option value={code} key={code}>{name}</Select.Option>
                    })}
                  </Select>
                </Form.Item>
              </Col> : <Col span={24}>
                <Form.Item
                  rules={[{
                    required: false,
                    message: "请输入数字和字母",
                    pattern: /^[0-9a-zA-Z]*$/
                  }]} {...FORMITEM_LAYOUT} name="policeCode" label="警员编号"
                  labelCol={{ style: { width: '100px' } }}
                  >
                  <Input placeholder="警员编号" maxLength={6} />
                </Form.Item>
              </Col>}
            <Col span={24}>
              <Form.Item rules={[
                {
                  required: true,
                  message: "请选择数据权限"
                }
              ]} {...FORMITEM_LAYOUT} name="dataConstraint" label="数据权限"
              labelCol={{ style: { width: '100px' } }}
              >
                <Radio.Group>
                  <Radio value={2} key={2}>本人数据</Radio>
                  <Radio value={1} key={1}>全部数据</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {/*<Col span={24}>*/}
            {/*  <Form.Item*/}
            {/*    extra={'ip地址格式0.0.0.0~255.255.255.255，至少填写一个ip地址，至多填写5个；多个ip地址之间以,分割。'}*/}
            {/*    rules={iPtest()}*/}
            {/*    {...FORMITEM_LAYOUT} name="ipAddress" label="IP地址">*/}
            {/*    <Input placeholder="IP地址"/>*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
          </div>
          <div className="row-right">
            <Upload title='本地上传头像' electronicSignImg={userImage} getUploadedRes={(res) => {
              if (res?.code === 0) {
                openNotification({ message: "图片上传成功" }, "success")
                form.setFieldsValue({
                  photo: res?.data?.uri
                })
                setUserImage(res.data.uri)
              } else {
                form.setFieldsValue({
                  photo: ""
                })
                setUserImage("")
                openNotification({ message: "图片上传失败" }, "error")
              }
            }} />
          </div>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ user, global }) => ({
  isCuUserModalVisible: user.isCuUserModalVisible,
  treeSelectList: global.treeSelectList,
  optionSelectList: global.optionSelectList,
  schList: global.schList
}))(CuUserModal)
