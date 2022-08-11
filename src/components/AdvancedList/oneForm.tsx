import React, {FC, useEffect, useState, useRef} from 'react'
import {Form, Button, Row, Col, Select, Radio, Checkbox, Input, Modal} from 'antd'
import {LineOutlined} from "@ant-design/icons";
import SavedStutas from "./savedStutas";
import {comboboxTypes} from "@/api/system";
import {
  ItemInterface,
  DetailInterface,
  DictTypesInterface,
  DictTypeInterface,
  FormDataInterFace
} from './itemInterface'

interface OneFormProps {
  data?: ItemInterface
  index?: number
  dictTypes?: DictTypesInterface
  removeOneOfVirtualArchiveConfigList?: any
  removeOneOfDetails?: any
  addOneOfDetails?: any
  updateMyStatus?: any
  updateData?: any
  updateVirtualArchiveConfigListOfOne?: any
}

interface OneChildProps {
  data?: DetailInterface | any
  index?: number
  add?: any
  remove?: any
  keys?: number
  fieldKey?: any
  name?: any
  restfield?: any
}

const OneForm: FC<OneFormProps> = ({
                                     data,
                                     index,
                                     dictTypes,
                                     removeOneOfVirtualArchiveConfigList,
                                     removeOneOfDetails,
                                     addOneOfDetails,
                                     updateMyStatus,
                                     updateData,
                                     updateVirtualArchiveConfigListOfOne
                                   }) => {
  const [form] = Form.useForm<FormDataInterFace>()
  const [formData, setFormData] = useState(data)
  const [bizTypeValue, setBizTypeValue] = useState<string | string[]>('')
  const [businessTypeDetails, setBusinessTypeDetails] = useState<DictTypeInterface[]>([])

  useEffect(() => {
    return function cleanup() {
      valuesChangeHandler = null
    }
  }, [])

  useEffect(() => {
    // 如果子节点小于等于0，则初始化一个子节点
    if (formData.details.length <= 0) {
      addOneOfDetails()
    }
    formData && initFormData()
  }, [formData])

  useEffect(() => {
    if (bizTypeValue instanceof Array && bizTypeValue.length > 0) {
      let types;
      types = bizTypeValue.map(item => `business_type_detail_${item}`)
      comboboxTypes({types}).then(res => {
        setBusinessTypeDetails(res.data)
      })
    }
  }, [bizTypeValue])


  const initFormData = () => {
    const temp = {...formData}
    if (temp.businessType) {
      setBizTypeValue(temp.businessType)
    }
    form.setFieldsValue({
      ...temp,
    })
  }

  let valuesChangeHandler = (callback, callback2 = null) => {
    form.validateFields().then(async (res) => {
      let temp = res
      if (temp.details.length > 0) {
        temp.details.forEach(item => {
          if (item.archiveCode) {
            item['archiveName'] = dictTypes.archives_typeList.find(archive => archive.value === item.archiveCode).label
          } else {
            item['archiveName'] = ''
          }
        })
      }
      updateVirtualArchiveConfigListOfOne(temp, index)
      callback && callback(temp)
      callback2 && callback2(temp)
    })
  }

  const OneChild: FC<OneChildProps> = ({fieldKey, name, keys, add, remove, restfield}) => {
    return (
      <div className="advance-form-child" key={keys}>
        <div className="advance-form-child-left">
          <Row>
            <Col span={7}>
              <Form.Item
                label="档案名称"
                name={[name, 'archiveCode']}
                {...restfield}
                fieldKey={[fieldKey, 'archiveCode']}
              >
                <Select placeholder="请选择档案名称" allowClear>
                  {dictTypes.archives_typeList?.map(({value, label}) => {
                    return (
                      <Select.Option value={value} key={value}>
                        {label}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="是否必填" name={[name, 'isRequired']} {...restfield} fieldKey={[fieldKey, 'isRequired']}>
                <Radio.Group buttonStyle="solid">
                  {dictTypes.sys_yes_no_numList?.map(({code, name}) => {
                    return (
                      <Radio value={code} key={code}>
                        {name}
                      </Radio>
                    )
                  })}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="是否同步影像化" name={[name, 'isTransmission']} {...restfield}
                         fieldKey={[fieldKey, 'isTransmission']}>
                {<Radio.Group buttonStyle="solid">
                  {dictTypes.sys_yes_no_numList?.map(({code, name}) => {
                    return (
                      <Radio value={code} key={code}>
                        {name}
                      </Radio>
                    )
                  })}
                </Radio.Group>}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item rules={[{required: true, message: "请选择所属阶级"}]} label="所属阶级"
                         name={[name, 'stage']} {...restfield} fieldKey={[fieldKey, 'stage']}>
                <Select placeholder="请选择所属阶级" allowClear>
                  {dictTypes.businessStatusList?.map(({code, name}) => {
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
        </div>
        <div onClick={() => removeOneOfDetails(keys)} className="advance-form-child-right"><LineOutlined/></div>
      </div>
    )
  }


  return (
    formData.myStatus === '保存'
      ? <div className="advance-form" key={index}>
        <Form form={form} scrollToFirstError>
          <div className="advance-form-father">
            <div className="advance-form-father-top">
              <div className="advance-form-father-form">
                <Row>
                  <Col span={24}>
                    <Form.Item label="配置名称" name="name" rules={[{required: true,message: "请输入配置名称!"}, {pattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{2,30}/, message: "请输入2-30个字符!"}]}>
                      <Input maxLength={30} placeholder="请输入配置名称"/>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className="advance-form-father-button">
                <Button className='edit-or-save' onClick={() => {
                  valuesChangeHandler((res) => updateData({...data, ...res}))
                }
                } type="primary">{formData.myStatus}</Button>
                <Button className='delete' onClick={() => {
                  Modal.confirm({
                    title: "删除",
                    content: "确认删除?",
                    centered: true,
                    onOk: () => {
                      removeOneOfVirtualArchiveConfigList()
                    }
                  })
                }}>删除</Button>
              </div>
            </div>
            <div className="advance-form-father-bottom">
              <Row>
                <Col span={6}>
                  <Form.Item label="准驾车型" name="perdritype" rules={[{required: true, message: "请选择准驾车型"}]}>
                    <Select maxTagCount={3} mode="multiple" placeholder="请选择准驾车型" allowClear>
                      {dictTypes.perdritypeList?.map(({value, label}) => {
                        return (
                          <Select.Option value={value} key={value}>
                            {label}
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6} offset={3}>
                  <Form.Item label="业务总类" name="businessType" rules={[{required: true, message: "请选择业务总类"}]}>
                    <Select maxTagCount={3} mode="multiple" placeholder="请选择业务总类" allowClear onChange={(e) => {
                      // setFlag(true)
                      setBusinessTypeDetails([])
                      setBizTypeValue(e as string)
                      form.setFieldsValue({
                        businessDetail: undefined
                      })
                    }}>
                      {dictTypes.bizTypeList?.map(({value, label}) => {
                        return (
                          <Select.Option value={value} key={value}>
                            {label}
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6} offset={3}>
                  <Form.Item label="业务分类" name="businessDetail" rules={[{required: true, message: "请选择业务分类"}]}>
                    <Select maxTagCount={3} mode="multiple" placeholder="请选择业务分类" allowClear>
                      {
                        (businessTypeDetails as any)?.map(
                          ({boxs}: any) =>
                            boxs.map(
                              ({code, name}) => <Select.Option value={code} key={code}>
                                {name}
                              </Select.Option>
                            )
                        )
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <Form.Item label="是否唯一" name="only" rules={[{required: true, message: "请选择是否唯一"}]}>
                    <Radio.Group buttonStyle="solid">
                      {dictTypes.sys_yes_no_numList?.map(({value, label}) => {
                        return (
                          <Radio value={value} key={value}>
                            {label}
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} offset={1}>
                  <Form.Item label="驾驶人来源" name="source" rules={[{required: true, message: "请选择驾驶人来源"}]}>
                    <Checkbox.Group options={dictTypes.driverSourceList}/>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="申请方式" name="way" rules={[{required: true, message: "请选择申请方式"}]}>
                    <Checkbox.Group options={dictTypes.student_wayList}/>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
          <div className="advance-form-children">
            <Form.List name="details">
              {
                (fields, {add, remove}) =>
                  fields.map(({key, name, fieldKey, ...restField}) => {
                    return <OneChild key={key} name={name} keys={key} fieldKey={fieldKey} add={add} remove={remove}
                                     restfield={restField}/>
                  })
              }
            </Form.List>
            <Button onClick={() => {
              valuesChangeHandler((res) => addOneOfDetails(res))
              setTimeout(() => {
                const box = document.getElementsByClassName(' paved whiteCard')[0]
                const searchForm = document.getElementsByClassName('searchContainer')[0]
                const item = document.querySelectorAll('.container>div:nth-child(2)>div')
                let height = 0
                for(let i = 0; i <= index; i++) {
                  height += item[i].clientHeight
                }
                height += searchForm.clientHeight
                const scrollTo = (height - box.clientHeight + 50) > 0 ? (height - box.clientHeight + 300) : 0
                box.scrollTo({
                  top: scrollTo,
                  behavior: 'smooth'
                })
              })
            }} type="dashed" block>增加</Button>
          </div>
        </Form>
      </div>
      : <SavedStutas dictTypes={dictTypes} formData={formData}
                     removeOneOfVirtualArchiveConfigList={removeOneOfVirtualArchiveConfigList}
                     updateMyStatus={updateMyStatus}/>
  )
}

export default OneForm
