import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import {TableView, WhiteCard, Images,SearchForm} from '@/components'
import {Button,  Form, Space, Input} from 'antd'
import {getPagation} from '@/utils'
import {STATE} from './model'
//安全员分配列表
const Verification = ({ dispatch, verificaList, searchAutographForm, }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id,] = useState(0)
  useEffect(() => {
    dispatch({
      type: 'verification/save',
      payload: {
        searchAutographForm: { ...STATE.searchAutographForm }
      },
    })
    getData()
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'verification/save',
      payload: {
        searchAutographForm: { ...searchAutographForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'verification/loadverificaList'
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
            key: 'name',
            component: <Input maxLength={20} placeholder="请输入安全员姓名" key="name" />
          },
          {
            key: 'examSite',
            component: <Input maxLength={20} placeholder="请输入考场名称" key="examSite" />
          }
        ]}
        actions={
          <Button
            onClick={() => {
              form.resetFields()
              dispatch({
                type: 'verification/save',
                payload: {
                  searchAutographForm: STATE.searchAutographForm
                }
              })
              getData()
            }}
          >
            重置
          </Button>
        }
        handleSearch={e => {
          dispatch({
            type: 'verification/save',
            payload: {
              searcSheetForm: { ...searchAutographForm, pageNum: 1, ...e }
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
      title: '核验照片',
      dataIndex: 'picUrl',
      width: 80,
      render: (text, record, index) => {
        return <Images src={text} width={30} height={40} />
      }
    },
    {
      title: '核验时间',
      dataIndex: 'createdTime',
      width: 150,
    }, {
      title: '姓名',
      width: 100,
      dataIndex: 'name',
    }, {
      title: '身份证号码',
      dataIndex: 'idCard',
      width: 120,
    }, {
      title: '联系方式',
      dataIndex: 'contactPhone',
      width: 120,
    }, {
      title: '考场名称',
      dataIndex: 'examSite',
      width: 120,
    },
    {
      title: '考车编号/号牌',
      dataIndex: 'assignSite',
      width: 120,
    },
  ]

  return (
    <WhiteCard style={{ background: 'transparent' }}>
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
export default connect(({ verification }) => ({
  verificaList: verification.verificaList,
  searchAutographForm: verification.searchAutographForm

}))(Verification)


