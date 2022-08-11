import React, {useState, useEffect} from "react";
import {Modal, Form, Row, Col, Input, TreeSelect, Radio} from "antd";
import {connect} from "dva";
import {FORMITEM_LAYOUT, TEL_REGEXP} from "@/utils/constants";
import {getDict} from "@/utils/publicFunc";
const { TreeNode } = TreeSelect

const EditModal = ({
                     isEditModalVisible,
                     dispatch,
                     id,
                     schoolConfigInfo,
                     school_config_clean_typeList,
                     sys_normal_disableList,
                     treeSelectList,
                   }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [office, setOffice] = useState("");

  useEffect(() => {
    getDict(dispatch, "school_config_clean_type")
    getDict(dispatch, "sys_normal_disable")
    dispatch({
      type: "global/treeSelectList"
    })
  }, [])

  useEffect(() => {
    id && getData()
  }, [id])
  useEffect(() => {
    if (JSON.stringify(schoolConfigInfo) !== "{}") {
      form.setFieldsValue({
        ...schoolConfigInfo,
      });
    }
  }, [schoolConfigInfo])

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
    setOffice(str)
    form.setFieldsValue({
      office: res[0]
    })
  }

  const getData = async () => {
    setLoading(true);
    await dispatch({
      type: "drivingSchool/loadSchoolConfigInfo",
      payload: {
        id,
      },
    });
    setLoading(false);
  }

  return (
    <Modal
      title="信息编辑"
      visible={isEditModalVisible}
      confirmLoading={loading}
      width={700}
      onOk={() => {
        form.validateFields().then((res) => {
          dispatch({
            type: "drivingSchool/saveSchoolConfig",
            payload: {
              ...res,
              schoolId: id,
              office: office.split("_")[0]
            },
          });
        })
      }}
      onCancel={() => {
        dispatch({
          type: "drivingSchool/save",
          payload: {
            isEditModalVisible: false,
            id: ''
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
        <Row style={{padding: "8px 40px", justifyContent: "space-between"}}>
          <Col span={24}>
            <Form.Item rules={[{required: true,message: "请选择预录入限制周期"}]}
              {...FORMITEM_LAYOUT} name="cleanCore" label="预录入限制周期">
              <Radio.Group>
                {
                  school_config_clean_typeList.map((item) => {
                    return (
                      <Radio value={item.value} key={item.value}>{item.label}</Radio>
                    )
                  })
                }
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{required: true,message: "请输入预录入人次设置"}, {pattern: /(^[1-9]\d{0,5}(\.[0-9]{1,2})?$)|(^[0](\.\d{1,2})?$)|(^[1][0]{6}(\.[0]{1,2})?$)/, message: "请输入0到100万之间的数字!"}]}
              {...FORMITEM_LAYOUT} name="signupCount" label="预录入人次设置">
              <Input placeholder="预录入人次设置" maxLength={10}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{required: true,message: "请选择预录入状态"}]}
              {...FORMITEM_LAYOUT} name="signupStatus" label="预录入状态">
              <Radio.Group>
                {
                  sys_normal_disableList.map((item) => {
                    return (
                      <Radio value={item.value} key={item.value}>{item.label}</Radio>
                    )
                  })
                }
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: "请填写所属部门"
              }
            ]} {...FORMITEM_LAYOUT} name="office" label="管理部门">
              <TreeSelect
                showSearch
                style={{width: "100%"}}
                dropdownStyle={{maxHeight: 400, overflow: "auto"}}
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
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({drivingSchool, global}) => ({
  isEditModalVisible: drivingSchool.isEditModalVisible,
  id: drivingSchool.id,
  schoolConfigInfo: drivingSchool.schoolConfigInfo,
  school_config_clean_typeList: global.school_config_clean_typeList,
  sys_normal_disableList: global.sys_normal_disableList,
  treeSelectList: global.treeSelectList,
}))(EditModal);
