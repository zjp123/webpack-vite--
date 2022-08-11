import React, { useEffect, useState } from 'react'
import { Button, Card, Tabs, message, Tag, Spin } from 'antd'
import { connect } from 'dva'
import { Pagination, Images } from '@/components'
import { getCheckRead, getStudentSuccess, getStudentError } from '@/api/electronic'
import { SPOTCHECK_STATUS } from '@/utils/constants'
import { getPagation } from '@/utils'
import './style.less'
const CheckspotCheckPage = ({ dispatch, match, checkStudentList, searchCheckStudentForm }) => {
    const [loading, setLoading] = useState(false)
    const { TabPane } = Tabs
    const { id } = match.params
    useEffect(() => {
        studentList()
    }, [])
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
        dispatch({
            type: 'spotCheck/save',
            payload: {
                searchCheckStudentForm: { ...searchCheckStudentForm, pageNum, pageSize }
            }
        })
        studentList()
    }
    //任务详情列表
    const studentList = async () => {
        setLoading(true)
        await dispatch({
            type: 'spotCheck/loadCheckStudentList',
            payload: {
                spotCheckId: id
            }
        })
        setLoading(false)
    }
    //基础信息
    const basicInfo = [
        {
            text: '身份证号',
            value: 'idcard'
        },
        {
            text: '准考证编号',
            value: 'admissionCertificateNumber'
        },
        {
            text: '准驾车型',
            value: 'perdritype'
        },
        {
            text: '报名时间',
            value: 'registrationTime'
        },
        {
            text: '移动电话',
            value: 'tel'
        },
        {
            text: '联系地址',
            value: 'address'
        },
        {
            text: '业务类型',
            value: 'businessType'
        },
        {
            text: '有效日期',
            value: 'effectiveTime'
        },
        {
            text: '体检医院',
            value: 'physicalExaminationHospital'
        },
        {
            text: '体检日期',
            value: 'physicalExaminationDate'
        },
        {
            text: '办理部门',
            value: 'office'
        }
    ]
    //标记已读
    const checkRead = studentFileId => {
        getCheckRead({ studentFileId }).then(({ code }) => {
            if (code === 0) {
                studentList()
            }
        })
    }
    // console.log(document.body.clientHeight, 'document.body.clientHeight')
    return (
        <Card>
            <Spin spinning={loading}>
                <ul className="checkspotCheckPage_ul" style={{ height: document.body.clientHeight - 160 }}>
                    {checkStudentList.length
                        ? checkStudentList.map(item => {
                            return (
                                <li key={item.id} style={{ position: 'relative' }}>
                                    <div className="tit">
                                        <div>
                                            <span
                                                className="span_btn"
                                                style={{ border: `1px solid ${SPOTCHECK_STATUS[item.spotCheckStatus || 0].color}`, background: SPOTCHECK_STATUS[item.spotCheckStatus || 0].color }}
                                            >
                                                {SPOTCHECK_STATUS[item.spotCheckStatus || 0].label}
                                            </span>
                                            <b>流水号:{item.serialNum}</b>
                                            <b>档案号:{item.fileNum}</b>
                                            <b>姓名: {item.stuName}</b>
                                            {item.fileNum ? <b>已制证</b> : null}
                                        </div>
                                        <Button
                                            size="middle"
                                            type="primary"
                                            style={{ scale: 0.5 }}
                                            disabled={!item.allCheckStatus}
                                            onClick={() => {
                                                if (item.spotCheckStatus !== 1) {
                                                    //不是已审查
                                                    getStudentSuccess({ stuId: item.id }).then(res => {
                                                        if (res.code === 0) {
                                                            studentList()
                                                        }
                                                    })
                                                } else {
                                                    message.success('已审查')
                                                }
                                            }}
                                        >
                                            审查完成
                                        </Button>
                                    </div>
                                    <div className="cuts"></div>
                                    <Tabs type="card" style={{ width: '90%' }}>
                                        {item.files.map((itm, index) => {
                                            return (
                                                <TabPane
                                                    key={itm.id}
                                                    tab={
                                                        <div
                                                            className={`pan ${itm.errorStatus === 1 ? 'text' : ''} ${itm.spotCheckStatus === 1 ? 'bai' : 'nothing'}`}
                                                            onClick={() => {
                                                                if (!itm.spotCheckStatus) {
                                                                    checkRead(itm.id)
                                                                }
                                                            }}
                                                        >
                                                            {itm.typeName}
                                                        </div>
                                                    }
                                                >
                                                    {itm.fileType === '-1' ? (
                                                        <ul className="base_ul">
                                                            {basicInfo.map((basicInfoItem, ind) => {
                                                                return (
                                                                    <li key={ind}>
                                                                        {basicInfoItem.text}:{item.studentInfo && item.studentInfo[basicInfoItem.value]}
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <div className="img-box" style={{ marginRight: '5px' }}>
                                                                <Images width={120}  height={105} src={itm.picUrl} enlarge={!!itm.picUrl}/>
                                                                {itm.picUrl&&<div className="pic-des">
                                                                    <span>上传日期</span>
                                                                    <span>{itm.picUrlDate}</span>
                                                                </div>}
                                                            </div>
                                                            <Tag
                                                                className="ele-tag"
                                                                color={itm.errorStatus === 1 ? 'blue' : 'red'}
                                                                onClick={() => {
                                                                    getStudentError({
                                                                        stuFileId: itm.id,
                                                                        status: itm.errorStatus === 1 ? 0 : 1
                                                                    }).then(res => {
                                                                        if (res.code === 0) {
                                                                            message.success(itm.errorStatus === 1 ? '取消异常成功' : '标记异常成功')
                                                                            studentList()
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                {itm.errorStatus === 1 ? '取消异常' : '标记异常'}
                                                            </Tag>
                                                        </div>
                                                    )}
                                                </TabPane>
                                            )
                                        })}
                                    </Tabs>
                                </li>
                            )
                        })
                        : null}
                </ul>
                <Pagination style={{ background: '#fff', textAlign: 'center' }} pagination={getPagation(searchCheckStudentForm)} getPageList={setPagation} />
                <p style={{ height: '10px', background: '#fff' }}></p>
            </Spin>
        </Card>
    )
}

export default connect(({ spotCheck }) => ({
    checkStudentList: spotCheck.checkStudentList,
    searchCheckStudentForm: spotCheck.searchCheckStudentForm
}))(CheckspotCheckPage)
