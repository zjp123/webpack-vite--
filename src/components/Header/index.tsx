import React, { FC } from "react"
import { Layout } from "antd"
import { BreadCrumb } from "@/components"
import { connect } from "react-redux"
import * as actions from "@/store/actions"
import style from "./Header.module.less"
interface Props extends ReduxProps {
  id?: string
  deleteHeaderContainer?: Function
  getBreadCrumbName?: Function
}

const Header: FC<Props> = ({ storeData: { userInfo }, id, deleteHeaderContainer, getBreadCrumbName}) => {
  const { globalRoutes } = userInfo
  return (
    <Layout.Header className={style.header}>

      <BreadCrumb
        id={id} getBreadCrumbName={getBreadCrumbName}
        deleteHeaderContainer={deleteHeaderContainer} globalRoutes={globalRoutes}/>

    </Layout.Header>
  )
}
export default connect(
  (state) => state,
  actions
)(Header)
