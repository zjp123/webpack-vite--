import React, {useEffect } from 'react'
import { connect } from 'dva'
import { WhiteCard, Pagination } from '@/components'
import { Button, Modal, Progress, Card, Radio } from 'antd'
import { goto, getPagation } from '@/utils'
import './style.less'
const Confirm = Modal.confirm
const SpotCheck = ({ dispatch, spotCheckList, searchSpotCheckForm }) => {
    useEffect(() => {
        getspotCheckList()
    }, [])
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
        dispatch({
            type: 'spotCheck/save',
            payload: {
                searchSpotCheckForm: { ...searchSpotCheckForm,pageNum, pageSize }
            }
        })
        getspotCheckList()
    }
    const getspotCheckList = async (payload = {}) => {
        await dispatch({
            type: 'spotCheck/loadSpotCheckList',
            payload
        })
    }
    return (
        <WhiteCard>
            <Card className="electron-card">
                <ul className="header">
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '20PX', marginLeft: '11px' }}>任务列表</span>
                        <Radio.Group
                            onChange={e => {
                                getspotCheckList({ status: e.target.value })
                            }}
                            defaultValue=""
                            style={{ marginBottom: 8 }}
                        >
                            <Radio.Button value="">全部</Radio.Button>
                            <Radio.Button value={0}>进行中</Radio.Button>
                            <Radio.Button value={1}>已完结</Radio.Button>
                        </Radio.Group>
                    </li>
                    <li style={{ height: '32px', border: 'dashed #d9d9d9 1px', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            onClick={() => {
                                Confirm({
                                    title: '您确定要生成新的电子档案抽查任务吗？',
                                    onOk: () => {
                                        dispatch({
                                            type: 'spotCheck/addCheck',
                                        })
                                    }
                                })
                            }}
                            style={{ border: 'none', background: 'none', outline: 'none', color: '#333333',fontSize:'14px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <span style={{fontSize: '18px', paddingRight: '5px'}}>+</span>生成抽查任务
                        </Button>
                    </li>
                    {spotCheckList.map(item => {
                        return (
                            <li style={{ borderBottom: '1px solid #E9E9E9FF', height: '60px',width:'100%', marginTop: '25px', display: 'flex', justifyContent: 'space-between' }} key={item}>
                                <div style={{minWidth:'260px'}}>
                                    <div>{item.createTime}</div>
                                    <div> {item.startMsg} </div>
                                </div>
                                <div style={{ minWidth: '160 px' }}>
                                    <div style={{ marginLeft: '19px' }}> {item.spotChechCount}</div>
                                    <div style={{ marginLeft: '-84px' }}>
                                    <div style={{textAlign:'left' }}> 开始时间</div>
                                    {item.createTime}
                                    </div>
                                </div>
                                <div >
                                    <Progress percent={Number(((item.checkCount / item.spotCheckCount) * 100).toFixed(2))} size="small" />
                                </div>
                                <div>
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            goto.push('/electronic/spotCheck/checkspotCheckPage/' + item.id)
                                        }}
                                        style={{ border: 'none', background: 'none', color: '#1890FF', marginRight: '50px' }}
                                    >
                                        审查
                                    </Button>
                                </div>
                            </li>
                        )
                    })}
                    <Pagination style={{ background: '#fff',textAlign:'center' }} pagination={getPagation(searchSpotCheckForm)} getPageList={setPagation} />
                </ul>
            </Card>
        </WhiteCard>
    )
}
export default connect(({ spotCheck }) => ({
    spotCheckList: spotCheck.spotCheckList,
    searchSpotCheckForm: spotCheck.searchSpotCheckForm,
    isCuSpotCheckModalVisible: spotCheck.isCuSpotCheckModalVisible
}))(SpotCheck)
