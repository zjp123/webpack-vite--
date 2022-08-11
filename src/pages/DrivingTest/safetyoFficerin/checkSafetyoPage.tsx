import React, {useEffect, useState} from 'react'
import {Col, Form, Row, Divider, Input, Select, Button} from 'antd'
import {connect} from 'dva'
import {TableView, WhiteCard, InfoCard, Images, SearchForm} from '@/components'
import {getSafetyoInfo} from '@/api/drivingTest'
import {getPagation} from '@/utils'
import {COMPARISON_RESULTS, SEX_NUMBER_ENUM} from '@/utils/constants'
import replacementPic from '@/components/Replacement'
import {STATE} from "@/pages/DrivingTest/safetyoFficerin/model";
import {CheckedAllButton, CheckedButton, DownloadButton} from "@/components/BatchDownload";
import CuSafetYoModal from "@/pages/DrivingTest/safetyoFficerin/cuSafetYoModal";
import bejtu from '@/assets/img/bejtu.png'

const CheckSafetyoPage = ({dispatch, match, searGetanquanyuanForm, getanquanyuanList}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [getGauanInfo, setgetGauanInfo] = useState({})
  const [whichTableView, setWhichTableView] = useState("school")
  const safetyOfficerId = match?.params?.safetyOfficerId
  useEffect(() => {
    getData()
    getInfo()
  }, [])
  const getInfo = () => {
    //获取详情
    if (safetyOfficerId) {
      ;(async () => {
        let res: any = await getSafetyoInfo({safetyOfficerId})
        if (res.code === 0) {
          setgetGauanInfo(res.data)
        }
      })()
    } else {
      form.resetFields()
    }
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'serialnum',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searGetanquanyuanForm.pageNum - 1) * searGetanquanyuanForm.pageSize + index + 1}</span>
      },
    },
    {
      title: '考场名称',
      dataIndex: 'examSiteName',
      width: 80,
    },
    {
      title: '监考时间',
      width: 60,
      dataIndex: 'invigilationTime',
    },
    {
      title: '考车号牌',
      dataIndex: 'examDevice',
      width: 60,
    },
    {
      title: '安全员入场照片',
      dataIndex: 'admissionPhoto',
      width: 80,
      render: text => {
        return text ? (
          replacementPic(text, <Images width={30} height={40} src={text} />, {})
        ) : (
          <img src={bejtu} style={{ marginRight: 0, width: '30px', height: `40px` }} alt="" />
        )
      }
    },
    {
      title: '入场照片拍摄时间',
      dataIndex: 'admissionPhotoTime',
      width: 90,
    },
    {
      title: '比对结果',
      dataIndex: 'compareResult',
      width: 80,
      render: text => {
        return <span style={{color: text === '不通过' ? '#FF2E3E' : '#00A70D'}}>{text}</span>
      },
    },
    {
      title: '监考记录',
      width: 120,
      render: (text, record, index) => {
        return record?.compareResult === "通过" ? (
          <>
            <a onClick={() => {
              setWhichTableView("student")
            }} style={{marginRight: '10px'}}>学员信息</a>
            <a onClick={() => {
            }}>导出全部名单</a>
          </>
        ) : (<span style={{color: '#FF2E3E'}}>空</span>)
      }
    }
  ]

  const studentColumns = [
    {
      title: () => <CheckedAllButton list={[1, 2, 3]} itemName='studentId'/>,
      width: 80,
      render: (text, record, index) => {
        return <>
          <CheckedButton value={record?.studentId}/>
          <span style={{marginLeft: '10px'}}>
            {/*{(searchInformationForm.pageNum - 1) * searchInformationForm.pageSize + index + 1}*/}
          </span>
        </>
      }
    },
    {
      title: '学员姓名'
    },
    {
      title: '身份证号码'
    },
    {
      title: '考试状态'
    },
    {
      title: '报名考试时间'
    },
    {
      title: '开启考试时间'
    },
    {
      title: '考试结束时间'
    },
    {
      title: '考试成绩'
    },
    {
      title: '补考成绩'
    },
    {
      title: '考试结果'
    },
    {
      title: '成绩单是否签字'
    },
    {
      title: '成绩单'
    },
    {
      title: '所属驾校'
    },
  ]

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: 'safetyoFficerin/save',
      payload: {
        searGetanquanyuanForm: {...searGetanquanyuanForm, pageNum, pageSize},
      },
    })
    getData()
  }
  //安全员基本信息
  const informaTion = [
    {
      title: '姓名',
      dataIndex: 'safetyOfficerName',
      required: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (text) => {
        const ITEM = SEX_NUMBER_ENUM.find(({value}) => value === text)
        if (!ITEM) {
          return '男'
        }
        return ITEM.sex
      },
    },
    {
      title: '身份证号码',
      dataIndex: 'idNumber',
    },
    {
      title: '联系方式',
      dataIndex: 'phonenumber',
    },
    {
      title: '住址',
      dataIndex: 'address',
    },
    {
      title: '所属单位',
      dataIndex: 'deptName',
    },
    {
      title: '创建人',
      dataIndex: 'createdByName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
    },
  ]

  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'safetyoFficerin/loadGetanquanyuanList',
      payload: {safetyOfficerId},
    })
    setLoading(false)
  }

  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            col: 4,
            component: <h3>考场名称:五八驾校科目三考场</h3>
          },
          {
            col: 3,
            component: <h3>考试日期:2022-01-18</h3>
          },
          {
            key: "safetyOfficerName",
            component: <Input maxLength={20} placeholder="请输入姓名/身份证明号码"/>
          },
          {
            key: "deptName",
            component: (
              <Select
                showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入签字状态"
                // onSearch={handleChiefSearch}
                // filterOption={handleFilterOption}
              >
                {/*{hospitalList?.map(({value, label, id}) => {*/}
                {/*  return <Select.Option value={value} key={id}>{label}</Select.Option>*/}
                {/*})}*/}
              </Select>
            )
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "safetyoFficerin/save",
                  payload: {
                    searSafetyoFficerinForm: STATE.searSafetyoFficerinForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <DownloadButton>导出全部</DownloadButton>
            <Button
              type='primary'
              onClick={() => {
                setWhichTableView("school")
              }
              }
            >
              返回监考列表
            </Button>
          </>
        }
        handleSearch={e => {
          let deptId = e && e['deptName']?.value
          let safetyOfficerName = e && e['safetyOfficerName']
          // dispatch({
          //   type: "safetyoFficerin/save",
          //   payload: {
          //     searSafetyoFficerinForm: {...searSafetyoFficerinForm, pageNum: 1, safetyOfficerName, deptId}
          //   }
          // })
          getData()
        }}
      />
    )
  }

  return (
    <div style={{display: 'flex', flexDirection: "column", height: '100%', background: '#fff'}}>
      <Row style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        borderBottom: '1px solid #d9d9d9',
        fontSize: '14px',
        padding: '12px 0 0',
        fontWeight: 'bold'
      }} align="middle">
        <Col style={{marginLeft: '10px', marginBottom: '10px'}}>安全员信息</Col>
      </Row>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <InfoCard style={{flex: '1', paddingRight: '5%'}} columns={informaTion} data={getGauanInfo}/>
        <div style={{marginRight: '36px'}}>
          <Images src={getGauanInfo['photo']} enlarge={true} width={150} height={150}/>
        </div>
      </div>
      {whichTableView === "school" && <>
        <h4 style={{padding: '20px 0 0 12px', margin: 0, marginBottom: '1px', textAlign: 'left'}}>监考列表</h4>
        <Divider/>
        <TableView
          style={{flex: 1}}
          pageProps={{
            getPageList: setPagation,
            pagination: getPagation(searGetanquanyuanForm),
          }}
          showTitle={false}
          dataSource={getanquanyuanList}
          columns={columns as any}
          rowKey="id"
          getSelection={getSelection}
          loading={loading}
        />
      </>}
      {whichTableView === "student" && <>
        <Divider/>
        <WhiteCard style={{backgroundColor: "transparent"}}>
          <TableView
            // pageProps={{
            //   getPageList: setPagation,
            //   pagination: getPagation(searSafetyoFficerinForm)
            // }}
            showTitle={false}
            // dataSource={safetyoFficerinList}
            search={searchForm()}
            columns={studentColumns as any}
            rowKey="id"
            loading={loading}
          />
        </WhiteCard>
      </>
      }
    </div>
  )
}
export default connect(({safetyoFficerin}) => ({
  safetyoFficerinList: safetyoFficerin.safetyoFficerinList,
  searGetanquanyuanForm: safetyoFficerin.searGetanquanyuanForm,
  getanquanyuanList: safetyoFficerin.getanquanyuanList,
}))(CheckSafetyoPage)
