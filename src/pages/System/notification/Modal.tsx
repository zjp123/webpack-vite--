import React, {FC, useEffect, useState} from 'react'
import AdvancedModal from '@/components/AdvancedModal/index.ts'
import {Select, Row, Col, Input, Form, Button, Upload, message, Checkbox, DatePicker} from 'antd'
import {UploadOutlined} from '@ant-design/icons';
import {connect} from 'dva'
import {Editor} from '@/components'
import type {SaveNotice, UpdateNotice} from "./interface";
import {getCookie} from "@/utils/auth";
import BASE_URL from "@/utils/base";
import {getDictApi} from "@/api/common";
import {getPagation, formatParameters} from "@/utils"
import moment from "moment";
import detectionEditorContent from "@/pages/System/notification/detectionEditorContent";
import formatJSON from "@/pages/System/notification/formatJSON";
import {encode, decode, atob} from 'js-base64'
import './style.less'

const Modal = ({
                 visible,
                 dispatch,
                 id,
                 noticeType,
                 noticeFrequency,
                 noticeSchoolList,
                 noticeUserLevel,
                 notice_content_template,
                 closeModal,
                 initContent,
                 currentContent,
                 defaultFileList,
                 noticeDetail
               }) => {
  const [form] = Form.useForm()
  const [currentNoticeUserLevel, setCurrentNoticeUserLevel] = useState<any>()

  useEffect(() => {
    return () => {
      dispatch({
        type: 'notification/save',
        payload: {
          noticeSchoolList: [],
          defaultFileList: [],
          initContent: '',
          currentContent: '',
        }
      })
    }
  }, [])

  useEffect(() => {
    id && getNoticeDetail()
  }, [id])

  useEffect(() => {
    if (noticeDetail && JSON.stringify(noticeDetail) !== "{}") {
      form.setFieldsValue({
        ...noticeDetail,
        time: [moment(noticeDetail.onlineTime), moment(noticeDetail.offlineTime)]
      })
      dispatch({
        type: 'notification/save',
        payload: {
          initContent: noticeDetail?.noticeContent ? decode(noticeDetail?.noticeContent) : '',
        }
      })
    }
  }, [noticeDetail])

  useEffect(() => {
    currentNoticeUserLevel === 'B' && getDictApi({type: 'noticeSchoolList'}).then(res => {
      dispatch({
        type: 'notification/save',
        payload: {
          noticeSchoolList: res.data.list
        }
      })
    })
  }, [currentNoticeUserLevel])

  const getNoticeDetail = async () => {
    await dispatch({
      type: 'notification/loadNoticeDetail'
    })
  }

  const handleSubmit = async (noticeStatus) => {
    const errorFileList = defaultFileList.filter(item => item.status === 'error')

    if (errorFileList && errorFileList.length > 0) {
      errorFileList.map(item => {
        message.error(`${item.name}????????????,?????????????????????????????????`)
      })
      return
    }

    form.validateFields().then(async (r) => {
      const noticeContentTemplate = (defaultFileList && defaultFileList.length > 0)
        ? detectionEditorContent(currentContent, notice_content_template, true)
        : detectionEditorContent(currentContent, notice_content_template)

      let res = formatParameters(r, {
        momentTrunString: [
          {
            formNameTime: "time",
            startTime: "onlineTime",
            endTime: "offlineTime",
            format: "YYYY-MM-DD HH:mm:ss"
          }
        ]
      })

      const payload = id
        ? {
          ...res,
          noticeContent: encode(currentContent),
          noticeContentTemplate,
          annex: formatJSON.beforeUpload(defaultFileList),
          noticeStatus,
          id
        } as UpdateNotice
        : {
          ...res,
          noticeContent: encode(currentContent),
          noticeContentTemplate,
          annex: formatJSON.beforeUpload(defaultFileList),
          noticeStatus,
        } as SaveNotice

      await dispatch({
        type: 'notification/saveOrUpdateNotice',
        payload
      })
      dispatch({
        type: 'notification/save',
        payload: {
          id: '',
          initContent: '',
          defaultFileList: []
        }
      })
      closeModal()
    })
  }

  const getContent = (content) => {
    dispatch({
      type: 'notification/save',
      payload: {
        currentContent: content
      }
    })
  }

  const uploadAttachment = (info) => {
    if (info.file.status === "uploading") {
      return
    }
    if (info.file.status === "done") {
      const {code, data, name, uid} = info.file.response
      if (code !== 0) {
        message.error('????????????')
        dispatch({
          type: 'notification/save',
          payload: {
            defaultFileList: [...defaultFileList, {
              ...info.file,
              status: 'error'
            }]
          }
        })
      } else {
        dispatch({
          type: 'notification/save',
          payload: {
            defaultFileList: [...defaultFileList, {
              ...info.file
            }]
          }
        })
      }
    }
  }

  const footer = <>
    <Upload
      name="file"
      fileList={defaultFileList}
      action={BASE_URL.SAAS_API + "/file/upload"}
      onChange={uploadAttachment}
      headers={{
        Authorization: "Bearer " + getCookie("token")
      }}
      defaultFileList={defaultFileList}
      onRemove={file => {
        dispatch({
          type: 'notification/save',
          payload: {
            defaultFileList: defaultFileList.filter(item => item.uid !== file.uid)
          }
        })
      }}
    >
      <Button icon={<UploadOutlined/>}>????????????</Button>
    </Upload>
  </>

  return (
    <Form form={form}>
      <AdvancedModal title="????????????" visible={visible} closeModal={closeModal} onSubmit={() => handleSubmit('2')}
                     onSave={() => handleSubmit('1')} footer={footer}>
        <AdvancedModal.Item title="????????????">
          <Form.Item rules={[
            {required: true, message: `?????????????????????`}
          ]} name="noticeUserLevel">
            <Select placeholder="?????????????????????" allowClear onChange={(value) => {
              setCurrentNoticeUserLevel(value)
              dispatch({
                type: 'notification/save',
                payload: {
                  noticeSchoolList: []
                }
              })
            }}>
              {noticeUserLevel?.map(({code, name}) => {
                return (
                  <Select.Option value={code} key={code}>
                    {name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          {
            (noticeSchoolList && noticeSchoolList.length > 0) && <Form.Item rules={[
              {required: true, message: `?????????????????????`}
            ]} name="noticeSchoolList">
              <Checkbox.Group style={{
                width: '100%',
                height: '400px',
                overflowY: 'scroll',
                marginTop: '10px',
                border: '1px solid #d9d9d9',
                borderRadius: '2px',
                padding: '10px'
              }}>
                {
                  noticeSchoolList?.map(({code, name}) => {
                    return (
                      <Row>
                        <Col span={24}>
                          <Checkbox value={code} key={code}>{name}</Checkbox>
                        </Col>
                      </Row>
                    )
                  })
                }
              </Checkbox.Group>
            </Form.Item>
          }
        </AdvancedModal.Item>
        <AdvancedModal.Item>
          <Row>
            <Col span={24}>
              <Form.Item rules={[
                {required: true, message: `?????????????????????`}
              ]} name="noticeName" label="????????????">
                <Input placeholder="?????????????????????..."/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item rules={[
                {required: true, message: `?????????????????????`}
              ]} name="noticeType" label="????????????">
                <Select placeholder="?????????????????????" allowClear>
                  {noticeType?.map(({code, name}) => {
                    return (
                      <Select.Option value={code} key={code}>
                        {name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} offset={0}>
              <Form.Item rules={[
                {required: true, message: `?????????????????????`}
              ]} name="noticeFrequency" label="????????????">
                <Select placeholder="?????????????????????" allowClear>
                  {noticeFrequency?.map(({name, code}) => {
                    return (
                      <Select.Option value={code} key={code}>
                        {name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item rules={[
                {required: true, message: `????????????????????????`}
              ]} name="time" label="???????????????">
                <DatePicker.RangePicker showTime disabledDate={(current) => current && current < moment().subtract(1, "days")} allowClear placeholder={["????????????", "????????????"]}/>
              </Form.Item>
            </Col>
          </Row>
        </AdvancedModal.Item>
        <AdvancedModal.Item title="????????????"
                            Editor={<Editor height={400} getContent={getContent} initContent={initContent}/>}/>
      </AdvancedModal>
    </Form>
  )
}

export default connect(({notification}) => ({
  visible: notification.visible,
  id: notification.id,
  noticeType: notification.noticeType,
  noticeFrequency: notification.noticeFrequency,
  noticeUserLevel: notification.noticeUserLevel,
  noticeSchoolList: notification.noticeSchoolList,
  notice_content_template: notification.notice_content_template,
  initContent: notification.initContent,
  currentContent: notification.currentContent,
  defaultFileList: notification.defaultFileList,
  noticeDetail: notification.noticeDetail,
}))(Modal)
