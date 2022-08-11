import {connect} from "dva";
import React, {useEffect, useState} from "react";
import {Form, Modal, Select, Row, Col} from "antd";
import {FORMITEM_LAYOUT} from "@/utils/constants";

const ChangeCarModal = ({dispatch, carList, safExamAssign, isShowChangeCarModal}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  //详情接口
  useEffect(() => {
    if (safExamAssign.assignCarId && safExamAssign.assignSite) {
      const changeCar = {
        value: safExamAssign.assignCarId,
        key: safExamAssign.assignCarId,
        label: safExamAssign.assignSite
      }
      form.setFieldsValue({
        changeCar,
      })
    } else {
      form.resetFields()
    }
  }, [safExamAssign])

  useEffect(() => {
    dispatch({
      type: 'assignTestCar/loadCarList',
      payload: {examSiteCode: safExamAssign.examSiteCode, examPlanId: safExamAssign.examPlanId}
    })
    return () => {
      dispatch({
        type: 'assignTestCar/save',
        payload: {
          carList: [],
          safExamAssign: {},
        }
      })
    }
  }, [])

  const closeModal = () => {
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        isShowChangeCarModal: false,
      }
    })
  }

  const clearSafExamAssign = () => {
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        safExamAssign: {},
      }
    })
  }

  const okHandler = () => {
    form.validateFields().then(async res => {
      setLoading(true)
      try {
        await dispatch({
          type: 'assignTestCar/changeSafExamCar',
          payload: {
            examStatus: safExamAssign.examStatus,
            safExamAssign: {
              id: safExamAssign.id,
              assignCarId: res.changeCar.value,
              assignSite: res.changeCar.label
            }
          }
        })
        await dispatch({
          type: 'assignTestCar/loadSafManualAssignmentList'
        })
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    })
    clearSafExamAssign()
    closeModal()
  }
  return (
    <Modal title="更换考车" visible={isShowChangeCarModal} onCancel={closeModal} onOk={okHandler}
           confirmLoading={loading}>
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请选择更换车辆'
                }
              ]}
              {...FORMITEM_LAYOUT}
              name="changeCar"
              label="更换车辆"
            >
              <Select labelInValue placeholder="请选择更换车辆..." allowClear>
                {carList?.map(({assignCarId, assignSite}) => {
                  return (
                    <Select.Option value={assignCarId} key={assignCarId}>
                      {assignSite}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({assignTestCar}) => ({
  carList: assignTestCar.carList,
  safExamAssign: assignTestCar.safExamAssign,
  isShowChangeCarModal: assignTestCar.isShowChangeCarModal,
}))(ChangeCarModal)
