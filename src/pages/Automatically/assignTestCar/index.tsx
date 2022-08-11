import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import {TableView, WhiteCard, Images, SearchForm} from '@/components'
import {Button, Form, Input, Modal, DatePicker, Select, Empty} from 'antd'
import {deleteObjectEmptyKey, getPagation, moment2String} from '@/utils'
import {STATE} from './model'
import {changeSafExamCarApi} from '@/api/automatically'
import AllocatingCarModal from "@/pages/Automatically/assignTestCar/allocatingCarModal";
import ChangeCarModal from "@/pages/Automatically/assignTestCar/ChangeCarModal";
import {getDict} from "@/utils/publicFunc";

const Confirm = Modal.confirm

//安全员分配列表
const AssignTestCar = ({
                        dispatch,
                        verificaList,
                        searchAutographForm,
                        isShowChangeCarModal,
                        examSessionList,
                        safManualAssignmentExsList,
                        safList,
                        examCarList
                      }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [showChangeCarModal, setShowChangeCarModal] = useState<boolean>(false)
  useEffect(() => {
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        searchAutographForm: {...STATE.searchAutographForm}
      },
    })
    getData()
    getDictList()
    return () => {
      dispatch({
        type: 'assignTestCar/save',
        payload: {
          searchAutographForm: {
            pageNum: 1,
            pageSize: 10,
          },
          verificaList: [],
          isCheckSpotCheckModalVisible: false,
          isShowChangeCarModal: false,
        }
      })
    }
  }, [])
  // 改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        searchAutographForm: {...searchAutographForm, pageNum, pageSize}
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'assignTestCar/loadSafManualAssignmentList'
    })
    setLoading(false)
  }
  // 获取下拉
  const getDictList = () => {
    ;["safManualAssignmentExs", "examSession", "saf", "examCar"].forEach(item =>
      getDict(dispatch, item))
  }

  const handleSearchSaf = async (val) => {
    getDict(dispatch, "saf", { keyword: val })
  }

  const handleSearchExs = async (val) => {
    getDict(dispatch, "safManualAssignmentExs", { keyword: val })
  }

  const handleSearchCar = async (val) => {
    getDict(dispatch, "examCar", { keyword: val })
  }

  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'invigilationTime',
            component: <DatePicker placeholder="监考日期" key="name"/>
          },
          {
            key: 'examSiteId',
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入考场名称"
              onSearch={handleSearchExs}
              filterOption={handleFilterOption}
            >
              {safManualAssignmentExsList?.map(({ value, label }) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>
          },
          {
            key: 'examSession',
            component: <Select placeholder="考试场次">
              {
                examSessionList.map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
              }
            </Select>
          },
          {
            key: 'safId',
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入安全员名称"
              onSearch={handleSearchSaf}
              filterOption={handleFilterOption}
              // notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请输入搜索内容" />}
            >
              {safList?.map(({ value, label }) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>
          },
          {
            key: 'examCarId',
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入考车号牌"
              onSearch={handleSearchCar}
              filterOption={handleFilterOption}
            >
              {examCarList?.map(({ value, label }) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'assignTestCar/save',
                  payload: {
                    searchAutographForm: STATE.searchAutographForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <Button
              type='primary'
              onClick={() => {
                setVisible(true)
              }
              }
            >
              分配考车
            </Button>
          </>
        }
        handleSearch={(e: any) => {
          if (e.invigilationTime) {
            e.invigilationTime = moment2String(e.invigilationTime)
          }
          const data = deleteObjectEmptyKey(e)
          if(data.safId) {
            data.safId = data.safId.value
          }
          if(data.examSiteId) {
            data.examSiteId = data.examSiteId.value
          }
          if(data.examCarId) {
            data.examCarId = data.examCarId.value
          }
          dispatch({
            type: 'assignTestCar/save',
            payload: {
              searchAutographForm: {...searchAutographForm, pageNum: 1, ...data}
            }
          })
          getData()
        }}
      />
    )
  }

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchAutographForm.pageNum - 1) * searchAutographForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '安全员姓名',
      dataIndex: 'name',
      width: 80
    },
    {
      title: '身份证号码',
      dataIndex: 'idCard',
      width: 150,
    }, {
      title: '监考车型',
      width: 100,
      dataIndex: 'perdritype',
    }, {
      title: '监考日期',
      dataIndex: 'invigilationTime',
      width: 120,
      render: text => text?.split(' ')[0]
    }, {
      title: '考场名称',
      dataIndex: 'examSite',
      width: 120,
    }, {
      title: '监考场次',
      dataIndex: 'examSession',
      width: 120,
    },
    {
      title: '考车',
      dataIndex: 'assignSite',
      width: 120,
    },
    {
      title: '分配人账号',
      dataIndex: 'createdBy',
      width: 120,
    },
    {
      title: "操作",
      width: 220,
      fixed: "right",
      render: (text, record) => {
        const invigilationTime = record.invigilationTime?.split(' ')[0].split('-')
        const nowDate = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]
        let flag = false
        for (let i = 0; i < 3; i++) {
          const invigilation = parseInt(invigilationTime[i])
          const now = nowDate[i]
          if (now > invigilation) {
            flag = true
            break
          }
        }
        return (
          <>
            <Button
              type="link"
              onClick={() => changeCar(record)}
              disabled={record.examStatus === '2' || flag}
            >
              更换考车
            </Button>
          </>
        )
      }
    }
  ]

  const changeCar = async (record) => {
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        isShowChangeCarModal: true,
        safExamAssign: {...record}
      }
    })
  }

  return (
    <WhiteCard style={{background: 'transparent'}}>
      {visible && <AllocatingCarModal title='分配考车' visible={visible} closeModal={() => setVisible(false)}/>}
      {isShowChangeCarModal && <ChangeCarModal/>}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchAutographForm)
        }}
        showTitle={false}
        dataSource={verificaList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        getSelection={getSelection}
        // isSelection={true}
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({assignTestCar, global}) => ({
  verificaList: assignTestCar.verificaList,
  searchAutographForm: assignTestCar.searchAutographForm,
  isShowChangeCarModal: assignTestCar.isShowChangeCarModal,
  safExamAssign: assignTestCar.safExamAssign,
  safManualAssignmentExsList: global.safManualAssignmentExsList,
  exsList: global.exsList,
  examSessionList: global.examSessionList,
  safList: global.safList,
  examCarList: global.examCarList,
}))(AssignTestCar)


