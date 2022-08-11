import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import './style.less'
import {SearchForm, WhiteCard} from '@/components'
import {Button, Form, Input, Select, Space, message} from 'antd'
import {STATE} from '@/pages/System/archiveConfig/model'
import {AdvancedList} from '@/components'
import {getDict} from '@/utils/publicFunc'
import {getDictApi} from '@/api/common'
import {initItem, ItemInterface, initDetail} from '@/components/AdvancedList/itemInterface'
import useFormatData from '@/utils/useFormatData'

export const initDict = data => {
  const temp = data
  for (let i = 0; i < temp.length; i++) {
    temp[i].label = temp[i].name
    temp[i].value = temp[i].code
  }
  return temp
}

const ArchiveConfig = ({
                         dispatch,
                         virtualArchiveConfigList,
                         archiveConfigList,
                         searchArchiveConfigForm,
                         perdritypeList,
                         bizTypeList,
                         archives_typeList,
                         sys_yes_no_numList,
                         student_wayList
                       }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [driverSourceList, setDriverSourceList] = useState([])
  const [businessStatusList, setBusinessStatusList] = useState([])
  const [startFlag, setStartFlag] = useState(false)
  const [startInit, setStartInit] = useState(false)

  useEffect(() => {
    getData()
    getDicts()
    return () => {
      dispatch({
        type: 'archiveConfig/save',
        payload: {
          searchArchiveConfigForm: STATE.searchArchiveConfigForm
        }
      })
    }
  }, [])

  const setVirtualArchiveConfigList = data => {
    dispatch({
      type: 'archiveConfig/save',
      payload: {
        virtualArchiveConfigList: data
      }
    })
  }

  useFormatData(startFlag, setStartFlag, virtualArchiveConfigList, setVirtualArchiveConfigList)
  // 是否开始初始化虚拟列表
  useEffect(() => {
    if (startInit) {
      if (archiveConfigList.length > 0) {
        setVirtualArchiveConfigList(initMyStatus(archiveConfigList))
      } else {
        setVirtualArchiveConfigList([initItem])
      }
      setStartInit(false)
    }
  }, [startInit])

  // 判断虚拟列表是否为空
  useEffect(() => {
    if (virtualArchiveConfigList.length === 0) {
      setVirtualArchiveConfigList([initItem])
    }
  }, [virtualArchiveConfigList])

  const initMyStatus = archiveConfigList => {
    let temp = archiveConfigList
    for (let i = 0; i < temp.length; i++) {
      temp[i].myStatus = '编辑'
    }
    return temp
  }

  const getDicts = () => {
    const dictsArr = ['perdritype', 'bizType', 'archives_type', 'sys_yes_no_num', 'student_way']
    dictsArr.forEach(item => {
      getDict(dispatch, item)
    })
    getDictApi({type: `驾驶人来源`}).then(res => {
      setDriverSourceList(initDict(res.data.list))
    })
    getDictApi({type: `学员业务状态`}).then(res => {
      setBusinessStatusList(initDict(res.data.list))
    })
  }

  const updateVirtualArchiveConfigListOfOne = (data, index) => {
    const newVirtualArchiveConfigList = [...virtualArchiveConfigList]
    newVirtualArchiveConfigList[index] = {...newVirtualArchiveConfigList[index], ...data}
    setVirtualArchiveConfigList(newVirtualArchiveConfigList)
  }

  const removeOneOfVirtualArchiveConfigList = async (index: number) => {
    const newVirtualArchiveConfigList = [...virtualArchiveConfigList]
    newVirtualArchiveConfigList[index].id &&
    (await dispatch({
      type: 'archiveConfig/delArchiveConfig',
      payload: {
        id: newVirtualArchiveConfigList[index].id
      }
    }))
    newVirtualArchiveConfigList.splice(index, 1)
    setVirtualArchiveConfigList(newVirtualArchiveConfigList)
  }

  const addOneOfVirtualArchiveConfigList = () => {
    const newVirtualArchiveConfigList = [...virtualArchiveConfigList]
    newVirtualArchiveConfigList.push(initItem)
    setVirtualArchiveConfigList(newVirtualArchiveConfigList)
  }

  const removeOneOfDetails = (fatherIndex, childIndex) => {
    const newVirtualArchiveConfigList = [...virtualArchiveConfigList]
    newVirtualArchiveConfigList[fatherIndex].details.splice(childIndex, 1)
    setVirtualArchiveConfigList(newVirtualArchiveConfigList)
  }

  const addOneOfDetails = (fatherIndex, formData) => {
    const newVirtualArchiveConfigList = [...virtualArchiveConfigList]
    newVirtualArchiveConfigList[fatherIndex] = {...newVirtualArchiveConfigList[fatherIndex], ...formData}
    newVirtualArchiveConfigList[fatherIndex].details.push(initDetail)
    setVirtualArchiveConfigList(newVirtualArchiveConfigList)
  }

  const updateMyStatus = (index: number) => {
    let newVirtualArchiveConfigList = [...virtualArchiveConfigList]
    newVirtualArchiveConfigList = newVirtualArchiveConfigList.map((item, i) => {
      if (i !== index) {
        item.myStatus = '编辑'
      }
      return item
    })
    newVirtualArchiveConfigList[index].myStatus = newVirtualArchiveConfigList[index].myStatus === '编辑' ? '保存' : '编辑'
    setVirtualArchiveConfigList(newVirtualArchiveConfigList)
    // 开始 分割/合并 formData
    setStartFlag(true)
  }

  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'archiveConfig/loadArchiveConfigList'
    })
    // 开始 分割/合并 formData
    setStartFlag(true)
    // 开始初始化数据
    setStartInit(true)
    setLoading(false)
  }
  const updateData = async (formData: ItemInterface) => {
    await dispatch({
      type: `archiveConfig/${formData.id ? 'updateArchiveConfig' : 'addArchiveConfig'}`,
      payload: {
        ...formData
      }
    })
    getData()
  }
  //查询区域
  const searchForm = () => {
    return (
      <div className="searchContainer">
        <SearchForm
          form={form}
          components={[
            {
              key: 'perdritype',
              component: <Select placeholder="请选择准驾车型" allowClear>
                {perdritypeList?.map(({value, label}) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            },
            {
              key: 'businessType',
              component: <Select placeholder="请选择业务总类" allowClear >
                {bizTypeList?.map(({value, label}) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            }
          ]}
          actions={
            <Space>
              <Button
                onClick={async () => {
                  form.resetFields()
                  await dispatch({
                    type: 'archiveConfig/save',
                    payload: {
                      searchArchiveConfigForm: STATE.searchArchiveConfigForm
                    }
                  })
                  getData()
                }}
              >
                重置
              </Button>
              <Button
                onClick={() => {
                  if (virtualArchiveConfigList.find(item => item.myStatus === '保存')) {
                    message.warning('请先保存')
                    return
                  }
                  addOneOfVirtualArchiveConfigList()
                  setTimeout(() => {
                    const box = document.getElementsByClassName(' paved whiteCard')[0]
                    box.scrollTo({
                      top: box.scrollHeight,
                      behavior: 'smooth'
                    })
                  })
                }}
              >
                增加
              </Button>
            </Space>
          }
          handleSearch={e => {
            dispatch({
              type: 'archiveConfig/save',
              payload: {
                searchArchiveConfigForm: {...searchArchiveConfigForm, ...e}
              }
            })
            getData()
          }}
        />
      </div>
    )
  }

  return (
    <>
      <WhiteCard>
        <div className="container">
          {searchForm()}
          <AdvancedList
            loading={loading}
            dataList={virtualArchiveConfigList}
            removeOneOfVirtualArchiveConfigList={removeOneOfVirtualArchiveConfigList}
            removeOneOfDetails={removeOneOfDetails}
            addOneOfDetails={addOneOfDetails}
            updateMyStatus={updateMyStatus}
            updateData={updateData}
            updateVirtualArchiveConfigListOfOne={updateVirtualArchiveConfigListOfOne}
            dictTypes={{
              perdritypeList,
              bizTypeList,
              archives_typeList,
              sys_yes_no_numList,
              driverSourceList,
              student_wayList,
              businessStatusList
            }}
          />
        </div>
      </WhiteCard>
    </>
  )
}
export default connect(({archiveConfig, global}) => ({
  archiveConfigList: archiveConfig.archiveConfigList,
  searchArchiveConfigForm: archiveConfig.searchArchiveConfigForm,
  virtualArchiveConfigList: archiveConfig.virtualArchiveConfigList,
  perdritypeList: global.perdritypeList,
  bizTypeList: global.bizTypeList,
  archives_typeList: global.archives_typeList,
  sys_yes_no_numList: global.sys_yes_no_numList,
  student_wayList: global.student_wayList
}))(ArchiveConfig)
