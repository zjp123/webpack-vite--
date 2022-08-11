import React, { useEffect, useState } from 'react'
import { Row, Button } from 'antd'
import { connect } from 'dva'
import { WhiteCard, InfoCard, Images } from '@/components'
import { HOSPITAL_DETAIL_COLUMNS } from './columns'
import { getHospitalDetailApi } from '@/api/student'
import HospitalModal from './hospitalModal'
import './style.less'

const HospitalDetail = ({ match }) => {
  const [hospitalDetailInfoCardData, setHospitalDetailInfoCardData] = useState<any>({})
  const id = match?.params?.id
  const [isShowHospitalModal, setIsShowHospitalModal]=useState(false)

  useEffect(() => {
    getHospitalDetail()
  }, [])

  // 获取 医院管理详情
  const getHospitalDetail = async () => {
    if (id) {
      let res: any = await getHospitalDetailApi({ id })
      if (res?.code === 0) {
        setHospitalDetailInfoCardData(res.data)
      }
    }
  }

  return (
    <WhiteCard
      title={
        <Row style={{ display: "flex", justifyContent: "space-between" }} align='middle'>
          <span
            style={{ fontSize: 18, fontWeight: 500, paddingLeft: '6px' }}>{hospitalDetailInfoCardData["name"]}</span>
          <Button
            style={{ marginRight: '8px' }}
            type="primary"
            onClick={() => {
              setIsShowHospitalModal(true)
            }}
          >
            修改医院
          </Button>
        </Row>
      }>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <InfoCard column={3} columns={HOSPITAL_DETAIL_COLUMNS} data={hospitalDetailInfoCardData} style={{ paddingLeft: '15px', paddingBottom: '20px' }} />
        <ul style={{ display: "flex", marginTop: '30px', listStyle: 'none', borderTop: '5px solid #f0f2f5', flex: 1, padding: 0, margin: 0 }}>
          <li style={{ width: '50%', borderRight: '5px solid #f0f2f5', padding: '15px',display:'flex',flexDirection:'column' }}>
            <h3 style={{ marginRight: '20px' }}>医疗机构执业许可证</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,flex:1}}>
              <Images src={hospitalDetailInfoCardData["licenceUrl"]} enlarge={false} width={'48%'} />
            </div>
          </li>
          <li style={{ width: '50%', padding: '15px',display:'flex',flexDirection:'column' }}>
            <h3>医疗机电子签章</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,flex:1}}>
              <Images src={hospitalDetailInfoCardData["eleSealUrl"]} enlarge={false} width={100} />
            </div>
          </li>
        </ul>
        {isShowHospitalModal && <HospitalModal id={id} isShowHospitalModal={isShowHospitalModal} setIsShowHospitalModal={setIsShowHospitalModal} updateHospitalDetail={getHospitalDetail} />}
      </div>
    </WhiteCard>
  )
}
export default connect(({}) => ({
}))(HospitalDetail)
