import React, {useState, useEffect} from 'react'
import {connect} from 'dva'

const Iframe = (props) => {
  const [flag, setFlag] = useState(false)
  useEffect(() => {
    if(flag) {
      let iframe = document.getElementById('iframe') as any
      iframe = iframe.contentWindow
      console.log(iframe)
    }
  },[flag])
  const loadHandle = () => {
    setFlag(true)
  }
  return (
    <div style={{width: "100%", height: "100%"}}>
      <iframe id="iframe" scrolling="yes" frameBorder="0"
              style={{width: '100%', height: "100%", overflow: 'visible'}}
              onLoad={loadHandle}
              src="http://10.56.83.126:8008/view/frm/html/index.html"/>
      {/*https://gab.122.gov.cn/m/login?s=2*/}
      {/*http://10.56.83.126:8008/view/frm/html/index.html*/}
    </div>
  )
}

export default connect(({}) => ({}))(Iframe)
