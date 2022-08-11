/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 13:37:06
 * @description: 系统首页拆分
 */
import React, { useEffect } from 'react'
import { connect } from 'dva'
import Banner from './Banner'
import DescCard from './DescCard'
import ExamineeCount from './ExamineeCount'
import PieChart from './PieChart'
import Last30Examinees from './Last30Examinees'
import SubjectAndRanking from './SubjectAndRanking'
import AbnormalCard from './AbnormalCard'
import InternetContentProvider from './InternetContentProvider'
import './indexPage.less'
import examineePortalLine from '@/assets/img/leader_cap_top_line.png'
import BASE_URL from "@/utils/base";
import * as process from "process";

// 系统首页
const SysIndex = ({ dispatch }) => {
  useEffect(() => {
    getIndexPageData()
  }, [])
  const getIndexPageData = () => {
    dispatch({
      type: 'sysIndex/loadSysIndexData'
    })
  }

  return (
    <div className="index_page_container">
      <Banner />
      <DescCard />
      <ExamineeCount />
      <PieChart />
      <Last30Examinees />
      <SubjectAndRanking />
      <AbnormalCard />
      {/* 备案号文字描述 */}
      <InternetContentProvider />
    </div>
  )
}
export default connect(({}) => ({}))(SysIndex)
