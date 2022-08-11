import React, { FC, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import withBreadcrumbs from "react-router-breadcrumbs-hoc"
import { Breadcrumb, Button } from "antd"
import { flattenRoutes, deleteButton } from "@/utils/publicFunc"
import { getFormattedMenus } from "@/router/routes"
import "./index.less"

const globalRoutes = (localStorage.getItem("getRouterList") && JSON.parse(localStorage.getItem("getRouterList")))|| []
const { menus } = getFormattedMenus(globalRoutes, false)
const allRoutes = deleteButton(flattenRoutes(menus))

interface IProps {
  breadcrumbs: any[]
  id?: string
  deleteHeaderContainer?: Function
  getBreadCrumbName?: Function
}

// 添加需要忽略的面包屑 => 名字匹配
// const ignoreBreadcrumbs = ["系统首页"]

// 通用面包屑
const Breadcrumbs: FC<IProps> = ({ id, deleteHeaderContainer, breadcrumbs, getBreadCrumbName }) => {
  const history = useHistory()
  useEffect(() => {
  }, [])

  // const newBreadcrumbs = breadcrumbs.filter(item => ignoreBreadcrumbs.find((itemInner) => item.name !== itemInner))
  const newBreadcrumbs = breadcrumbs

  const filteredBreadcrumbs = newBreadcrumbs?.filter((bcItem) => bcItem.name)

  const getColor = (index, filteredBreadcrumbs) => {
    return index === filteredBreadcrumbs.length - 1 ? "#333333" : ""
  }

  return (
    <div id="bread-container" className="bread-container">
      <Breadcrumb className="bread-style" separator=">">
        {filteredBreadcrumbs?.map((bc: CommonObjectType, index: number) => {
          // console.log("filteredBreadcrumbs -->>",filteredBreadcrumbs);
          getBreadCrumbName(bc?.name) // 获取当前面包屑 name
          return (
            <Breadcrumb.Item key={bc.key}>
              <Button
                disabled={bc.type === "subMenu" || index === filteredBreadcrumbs.length - 1}
                onClick={() => {
                  history.push(bc.match.path)
                }}
                style={{ padding: "0" }}
                type="link"
              >
                <span style={{ color: getColor(index, filteredBreadcrumbs) }}>{
                  bc.match.path === "/system/management/managementPage/:id/:name" ? `${bc.match?.params?.name}${bc.name}` : bc.name
                }</span>
              </Button>
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    </div>
  )
}

export default withBreadcrumbs(allRoutes, {
  excludePaths: ["/"]
})(Breadcrumbs)
