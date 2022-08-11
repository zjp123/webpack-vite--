import React, { useEffect, useState } from 'react'
import { connect } from 'dva';
import { TableView, WhiteCard, Images, SearchForm } from '@/components'
import { Button, Form, Space, Input, Modal, DatePicker, Select } from 'antd'
import { getPagation } from '@/utils'
import { STATE } from './model'
import { getDict } from "@/utils/publicFunc"
// @ts-ignore
import CuVehicleInformationModal from './cuVehicleInformationModal'
const Confirm = Modal.confirm

//安全员分配列表
const VehicleInformation = ({ dispatch, examSiteList, searchVehicleInformationForm, isCuVehicleInformationVisible, perdritypeList, examSiteTypeList, carBrandList, certifyingAuthorityList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  useEffect(() => {
    dispatch({
      type: 'vehicleInformation/save',
      payload: {
        searchVehicleInformationForm: { ...STATE.searchVehicleInformationForm }
      },
    })
    getDict(dispatch, "examSite")//考场：根据科目查询
    getDict(dispatch, "perdritype")//准驾车型
    getDict(dispatch, "carBrand")//车辆品牌
    getDict(dispatch, "certifyingAuthority")//发证机关
    getData()
  }, [])

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "examSite", { keyword: val })
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'vehicleInformation/save',
      payload: {
        searchVehicleInformationForm: { ...searchVehicleInformationForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'vehicleInformation/loadExamSiteList'
    })
    setLoading(false)
  }
  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'licenseNum',
            component: <Input placeholder="请输入车牌号码/考车编号" />
          },
          {
            key: 'examCode',
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入考场名称"
              onSearch={handleSearchExam}
              filterOption={handleFilterOption}
            >
              {examSiteTypeList?.map(({ value, label }) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>
            //   <Select placeholder="所属考场" allowClear>
            //   {examSiteTypeList.map(({ value, label }) => {
            //     return (
            //       <Select.Option value={value} key={value}>
            //         {label}
            //       </Select.Option>
            //     )
            //   })}
            // </Select>

          },
          {
            key: "perdritype",
            component: <Select placeholder="准驾车型" allowClear>
              {perdritypeList.map(({ value, label }) => {
                return (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                )
              })}
            </Select>
          },
          // {
          //   key: 'type',
          //   component: (
          //     <Select placeholder="车辆类型" allowClear>
          //       {carTypeList.map(({ value, label }) => {
          //         return (
          //           <Select.Option value={value} key={value}>
          //             {label}
          //           </Select.Option>
          //         )
          //       })}
          //     </Select>
          //   )
          // },
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'vehicleInformation/save',
                  payload: {
                    searchVehicleInformationForm: STATE.searchVehicleInformationForm
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
                setId(0)
                dispatch({
                  type: "vehicleInformation/save",
                  payload: {
                    isCuVehicleInformationVisible: true
                  }
                })
              }}>
              新增
            </Button>
          </Space>
        }
        handleSearch={e => {
          dispatch({
            type: 'vehicleInformation/save',
            payload: {
              searchVehicleInformationForm: { ...searchVehicleInformationForm, pageNum: 1, ...e }
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
        return <span>{(searchVehicleInformationForm.pageNum - 1) * searchVehicleInformationForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '车牌号码',
      dataIndex: 'licenseNum',
      width: 80
    },
    {
      title: '考试车辆编号',
      dataIndex: 'carNum',
      width: 100,
    }, {
      title: '所属考场',
      dataIndex: 'examName',
      width: 100,
    }, {
      title: '考试准驾车型',
      dataIndex: 'perdritype',
      width: 100,
    },
    //  {
    //   title: '车辆类型',
    //   dataIndex: 'typeName',
    //   width: 80,
    // },
     {
      title: '车辆品牌',
      dataIndex: 'brandName',
      width: 100,
    },
    {
      title: '车辆初次登记日期',
      dataIndex: 'fRegisterTime',
      width: 120,
    },
    {
      title: '强制报废日期',
      dataIndex: 'expiredTime',
      width: 120,
    },
    {
      title: '车辆状态',
      dataIndex: 'carStatusName',
      width: 80,
      render: (text, record) => {
        const examStatusArr = [
          {carStatus: "1", label: "正常",color:"green"},
          {carStatus: "2", label: "维修保养",color:"red"},
          {carStatus: "3", label: "报废",color:"#000"}
        ]
        const item = examStatusArr.find((item) => item.carStatus === record?.carStatus)
        return <span style={{color:item?.color}}>{item?.label}</span>
      }
    },
    {
      title: "操作",
      width: 110,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setId(record.id)
                dispatch({
                  type: "vehicleInformation/save",
                  payload: {
                    isCuVehicleInformationVisible: true
                  }
                })
              }}
            >
              编辑
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                Confirm({
                  title: "删除",
                  content: "确认要删除考试车辆信息吗?",
                  centered: true,
                  onOk: () => {
                    dispatch({
                      type: "vehicleInformation/deleteExamCar",
                      payload: {
                        id: record.id
                      }
                    })
                  }
                })
              }}
            >
              删除
            </Button>
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
          pagination: getPagation(searchVehicleInformationForm)
        }}
        showTitle={false}
        dataSource={examSiteList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        getSelection={getSelection}
        loading={loading}
      />
      {isCuVehicleInformationVisible && <CuVehicleInformationModal id={id} parentForm={form}/>}
    </WhiteCard>
  )
}
export default connect(({ vehicleInformation, global }) => ({
  examSiteList: vehicleInformation.examSiteList,
  searchVehicleInformationForm: vehicleInformation.searchVehicleInformationForm,
  isCuVehicleInformationVisible: vehicleInformation.isCuVehicleInformationVisible,
  perdritypeList: global.perdritypeList,//可培训车型
  examSiteTypeList: global.examSiteList,//考场
  // carTypeList: global.carTypeList,//车辆类型
  carBrandList: global.carBrandList,//车辆品牌
  certifyingAuthorityList: global.certifyingAuthorityList//发证机关
}))(VehicleInformation)


