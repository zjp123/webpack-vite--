import React, { useEffect } from 'react'
import {  Form, Row,Button } from 'antd'
import { connect } from 'dva';
import { WhiteCard } from '@/components'
import { getSafetyoInfo } from '@/api/drivingTest'
import { goto } from '@/utils'
const CheckSafetyoPage = ({ dispatch, match }) => {
    const [form] = Form.useForm()
    const safetyOfficerId = match?.params?.safetyOfficerId
    useEffect(() => {
        getData()
        getInfo()
    }, [])
    const getInfo = () => {
        //获取详情
        if (safetyOfficerId) {
            ; (async () => {
                let res: any = await getSafetyoInfo({ safetyOfficerId })
                if (res.code === 0) {
                }
            })()
        } else {
            form.resetFields()
        }
    }
    //获取列表数据
    const getData = async () => {
        await dispatch({
            type: 'safetyoFficerin/loadGetanquanyuanList',
            payload: { safetyOfficerId }
        })
    }
    return (
        <WhiteCard title={
            <Row style={{ display: 'flex', justifyContent: 'space-between' }} align='middle'>
                      <Button
                        size='small'
                        style={{ margin: '4px' }}
                        onClick={() => {
                            goto.push('/Student/medical')
                        }}
                        type='primary'
                        className='mar-l-4'
                    >返回</Button>
            </Row>
        }>
        </WhiteCard>
    )
}
export default connect(({ medical }) => ({
    safetyoFficerinList: medical.safetyoFficerinList,
    searGetanquanyuanForm: medical.searGetanquanyuanForm,
    getanquanyuanList: medical.getanquanyuanList
}))(CheckSafetyoPage)


