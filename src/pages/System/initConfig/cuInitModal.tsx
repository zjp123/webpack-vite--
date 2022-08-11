import React, { useState, useEffect } from 'react'
import {Form, Input, Row, Col, Radio, Modal, Tree, Select,} from 'antd'
import { FORMITEM_LAYOUT, } from '@/utils/constants'
import { connect } from 'dva'
import { barrierGetClientInfo } from '@/api/system'
import {getDict} from "@/utils/publicFunc";
interface cuRoleModalProps {
  dispatch: Function
  editInitConfigList: any
  id?: string
  isCuInitModalVisible?: boolean
  gateControllerSchemeList?: any
}

const CuInitModal: React.FC<cuRoleModalProps> = props => {
  const { isCuInitModalVisible, dispatch, editInitConfigList, id, gateControllerSchemeList } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  //详情接口
  useEffect(() => {
    if (id) {
      dispatch({
        type: "initConfig/loadEditInitConfigList",
        payload: {
          initJobId: id
        }
      }).then(res => {
        res?.map(config => {
          form.setFieldsValue({
            [config.id]: config.dictValue
          })
        })
      })
    } else {
    }

    return () => {
      dispatch({
        type: 'initConfig/save',
        payload: {
          isCuInitModalVisible: false,
          id: '',
          editInitConfigList: [],
        }
      })
    }
  }, [id])

  return (
    <Modal
      title={null}
      visible={isCuInitModalVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async res => {
          setLoading(true)
          try {
            const configs = editInitConfigList.map(config => {
              return {
                dictType: config.dictType,
                dictLabel: config.dictLabel,
                dictValue: res[config.id]
              }
            })

            await dispatch({
              type: 'initConfig/updateInitConfigList',
              payload: {
                configs
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
          type: 'initConfig/save',
          payload: {
            isCuInitModalVisible: false
          }
        })
      }}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        autoComplete="off"
      >
        {
          editInitConfigList?.map(config => {
            return <Row key={config.id}>
              <Col span={24}>
                <Form.Item
                  {...FORMITEM_LAYOUT}
                  name={config.id}
                  label={config.name}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          })
        }

      </Form>
    </Modal>
  )
}

export default connect(({ initConfig, global }) => ({
  isCuInitModalVisible: initConfig.isCuInitModalVisible,
  editInitConfigList: initConfig.editInitConfigList,
  id: initConfig.id,
}))(CuInitModal)
