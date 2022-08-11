import React, { useEffect,  } from 'react'
import { connect } from 'dva'
import { WhiteCard, IDCardReader } from '@/components'


const HardwarTest = ({}) => {
  useEffect(() => {
    // readIDCard()
  }, [])

  return (
    <WhiteCard style={{background: 'transparent'}}>
      <h1 style={{textAlign: "center", fontSize: "20px", backgroundColor: "lightCyan"}}>硬件测试页</h1>
      <IDCardReader getReadResult={(res) => {
        console.log("组件内获取到的身份证结果 -->>", res);
      }}/>
    </WhiteCard>
  )
}
export default connect(({}) => ({}))(HardwarTest)
