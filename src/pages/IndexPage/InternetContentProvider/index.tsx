import React, { Fragment } from 'react'
import { version } from '@/utils/version'

const InternetContentProvider = () => {
  return (
    <Fragment>
      <div className="index_page_internet_content_provider">
        <div>
          <span style={{ marginRight: '10px', display: 'inline-block' }}>软件版本号：{version}</span>
          <span>建议您使用IE10+、360浏览器极速模式，分辨率1920*1080及以上浏览本网站，获得更好用户体验。</span>
        </div>
      </div>
    </Fragment>
  )
}
export default InternetContentProvider
