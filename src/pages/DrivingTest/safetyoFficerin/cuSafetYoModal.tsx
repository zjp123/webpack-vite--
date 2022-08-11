import React, { useState, useEffect } from 'react'
import {Form, Input, Row, Col, Radio, Modal, TreeSelect, Button, Select,} from 'antd'
import { connect } from 'dva';
import { Camera, Upload } from '@/components'
import {FORMITEM_LAYOUT, TEL_REGEXP, ID_REGEXP, NAME_REGEXP, IS_SIG_STATUS} from "@/utils/constants"
import { getSafetyoInfo } from '@/api/drivingTest'
import { getDict } from '@/utils/publicFunc'
import { CloseOutlined } from "@ant-design/icons"
import Images from "@/components/Images"
import './photo.less'
import PicturesWall from "@/components/UploadImage"
import clearimg from '@/assets/svg/clearimg.svg'

import { openNotification } from "@/components/OpenNotification"
const { TreeNode } = TreeSelect

interface CuSafetYoModalProps {
  id?: number,
  isGuanModalVisible: boolean,
  dispatch: Function,
  treeSelectList: [],
  exsList: any[]
  deptList: []
  fileDomainUrl: string,
  modalStatus: string,
  parentForm: object
}

const CuSafetYoModal: React.FC<CuSafetYoModalProps> = (props) => {
  const { id, dispatch, treeSelectList, exsList, fileDomainUrl, modalStatus, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState('')
  const [echoImage, setEchoImage] = useState('')
  const [isShow, setIsShow] = useState('init')
  //详情接口
  useEffect(() => {
    dispatch({
      type: 'global/treeSelectList'
    })
    dispatch({
      type: 'global/getFileDomain'
    })
    getDict(dispatch, "dept")
    getDict(dispatch, 'exs')
    if (id) {
      ; (async () => {
        let res: any = await getSafetyoInfo({ safetyOfficerId: id })
        if (res.code === 0) {
          if (res.data.photo) {
            setEchoImage(res.data.photo)
            setIsShow('echo')
          }
          form.setFieldsValue({ ...res.data })
        }
      })()
    } else {
      form.resetFields()
    }
  },
    [])

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", {keyword: val})
  }

  const getNode = (list) => {
    list = list || [];
    return list.map((data) => {
      return (
        <TreeNode title={data.label} key={data.id} value={`${data.id}`}>
          {
            data.children && getNode(data.children)
          }
        </TreeNode>
      );
    });
  }
  const onChange = (value) => {
    form.setFieldsValue({
      parentId: value,
    })
  };

  // 照片回显
  const Echo = () => {
    return (
      <div className='echo'>
        <img
          src={clearimg}
          onClick={() => {
            setEchoImage("")
            setIsShow('init')
            form.setFieldsValue({
              photo: ''
            })
          }}
          className='echo-icon' />
        <Images src={echoImage} />
      </div>
    )
  }

  // 初始化
  const Init = () => {
    return (
      <div className='init'>
        <Button onClick={() => setIsShow('camera')} type='primary'> 去拍照 </Button>
        <Button onClick={() => setIsShow('photo')} type="primary"> 上传照片 </Button>
      </div>
    )
  }

  return (
    <Modal
      title={(id ? '编辑' : '新增') + '安全员信息'}
      visible={true}
      width={800}
      confirmLoading={loading}
      centered
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            if (id) {
              res.safetyOfficerId = id
            }
            await dispatch({
              type: 'safetyoFficerin/addSafetyot',
              payload: {
                parentForm,
                postData: {
                  ...res, deptId: res.deptId
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
          type: 'safetyoFficerin/save',
          payload: {
            isSafeModalVisible: false
          }
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入合法姓名" }, { pattern: NAME_REGEXP, message: "请输入合法姓名" }]}
              {...FORMITEM_LAYOUT} name="safetyOfficerName" label="姓名">
              <Input placeholder="请输入姓名" maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true }]} {...FORMITEM_LAYOUT} name="sex" label="性别">
              <Radio.Group>
                <Radio value={0} key={0}>
                  男
                </Radio>
                <Radio value={1} key={1}>
                  女
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入合法身份证号" }, { pattern: ID_REGEXP, message: "请输入身份证号" }]}
              {...FORMITEM_LAYOUT} name="idNumber" label="身份证号">
              <Input placeholder="请输入身份证号" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "请输入合法手机号" }, { pattern: TEL_REGEXP, message: "请输入手机号" }]}

              {...FORMITEM_LAYOUT} name="phonenumber" label="联系方式">
              <Input placeholder="请输入联系方式" maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                message: '请输入住址',
                required: true,

              },
            ]} {...FORMITEM_LAYOUT} name="address" label="住址">
              <Input placeholder="请输入住址" maxLength={200} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                message: '请选择考场',
                required: true,
              },
            ]} name='examSiteId' label="考场" {...FORMITEM_LAYOUT}>
              <Select
                showSearch allowClear defaultActiveFirstOption={false} placeholder="请选择考场名称"
                onSearch={handleSearchExam} filterOption={handleFilterOption}
              >
                {exsList?.map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={modalStatus === 'add' ? [
              {
                message: '请填写所属部门',
              },
            ] : []} {...FORMITEM_LAYOUT} name="deptId" label="所属部门">
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
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
            <Form.Item rules={modalStatus === 'add' ? [
              {
                required: true,
                message: '上传安全员照片',
              },
            ] : []
            } {...FORMITEM_LAYOUT} name='photo' label="上传安全员照片">
              <div className="student_photo">
                <div>
                  {isShow === 'echo' && <Echo />}
                  {isShow === 'init' && <Init />}
                  {
                    isShow === 'photo' && <div className='photo'>
                      <Upload electronicSignImg={echoImage} getUploadedRes={(res) => {
                        if (res?.code === 0) {
                          openNotification({ message: "图片上传成功" }, "success")
                          form.setFieldsValue({
                            photo: res?.data?.uri
                          })
                          setEchoImage(res.data.uri)
                        } else {
                          form.setFieldsValue({
                            photo: ""
                          })
                          setEchoImage("")
                          openNotification({ message: "图片上传失败" }, "error")
                        }
                      }} />
                      <Button onClick={() => setIsShow('init')} type="primary"> 返回 </Button>
                    </div>
                  }
                  {
                    isShow === 'camera' && <div>
                      <div className="student_photo_camera">
                        <Camera onChange={(imgUrl) => {
                          setPhoto(imgUrl)
                          form.setFieldsValue({
                            photo: imgUrl
                          })
                        }} />
                      </div>
                      <div className="btn">
                        <Button onClick={() => {
                          setIsShow('init')
                        }} type="primary"> 返回 </Button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ safetyoFficerin, global }) => ({
  isSafeModalVisible: safetyoFficerin.isSafeModalVisible,
  treeSelectList: global.treeSelectList,
  deptList: global.deptList,
  exsList: global.exsList,
  fileDomainUrl: global.fileDomainUrl
}))(CuSafetYoModal)
