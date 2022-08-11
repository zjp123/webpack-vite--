import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Button, Layout, Menu} from 'antd'
import { flattenRoutes, getKeyName } from '@/utils/publicFunc'
import { getFormattedMenus } from '@/router/routes'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import './Menu.module.less'
import sysvg from '@/assets/svg/SY.svg'
const { SubMenu } = Menu
interface Props extends ReduxProps {
  globalRoutes: any[]
}

function getImageUrl(path: any) {
  return new URL(`../../assets/svg${path}.svg`, import.meta.url).href
}

type MenuType = CommonObjectType<string>
const MenuView: FC<Props> = ({ storeData: { userInfo, collapsed }, setStoreData }) => {
  const { globalRoutes } = userInfo
  const { pathname } = useLocation()
  const { catalogueMenus: menus } = getFormattedMenus(globalRoutes)
  const flatMenu = flattenRoutes(menus)
  const { tabKey: curKey = 'home' } = getKeyName(pathname, flatMenu)
  const [current, setCurrent] = useState(curKey)
  const [isFold, setIsFold] = useState(false)
  // 递归逐级向上获取最近一级的菜单，并高亮
  const higherMenuKey = useCallback(
    (checkKey = 'home', path = pathname) => {
      if (flatMenu.length <= 0) {
        return
      }
      if (flatMenu.some((item: MenuType) => item.key === checkKey)) {
        return checkKey
      }
      const higherPath = path && path.match(/(.*)\//g) && path.match(/(.*)\//g)[0].replace(/(.*)\//, '$1')
      const { tabKey } = getKeyName(higherPath, flatMenu)
      return higherMenuKey(tabKey, higherPath)
    },
    [pathname],
  )

  useEffect(() => setIsFold(collapsed), [collapsed])

  useEffect(() => {
    const { tabKey } = getKeyName(pathname, flatMenu)
    const higherKey = pathname !== "/" && higherMenuKey(tabKey)
    setCurrent(higherKey)
  }, [flatMenu, pathname])

  // 菜单点击事件
  const handleClick = ({ key }): void => {
    setCurrent(key)
  }

  // 子菜单的标题
  const subMenuTitle = (data: MenuType): JSX.Element => {
    // const {icon: MenuIcon, iconfont} = data
    // debugger
    return (
      <span>
        {/* 子菜单 动态 icon, 有错误,暂时注释,后续有需求再做修改 */}
        {/*{iconfont ? <MyIconFont type={iconfont} style={{fontSize: '14px'}}/> : !!MenuIcon && <MenuIcon/>}*/}
        <span className="noSelect">{data.name}</span>
      </span>
    )
  }

  // 创建可跳转的多级子菜单
  const createMenuItem = (data: MenuType): JSX.Element => {
    return (
      <Menu.Item
        key={data.key} style={{position: 'relative'}} title={data.name}
        icon={data.path === '/index' && (<img style={{marginBottom: '3.5px'}} className={!isFold && 'left5px'} src={sysvg} alt=""/>)}
        className={`noSelect ${data.iconfont && 'sub-menu-change'} ${(data.key === 'index' && !isFold) && 'index-title'}`}
      >
        {
          data.path.includes('leaderscock')
            ? <Button
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: 'rgba(255,255,255,0.65)'
              }}
              onClick={() => window.open('/#' + data.path)}
            >{subMenuTitle(data)}</Button>
            : <Link to={data.path}>{(isFold && data.path === '/index') ? '' : subMenuTitle(data)}</Link>
        }
      </Menu.Item>
    )
  }

  // 创建可展开的第一级子菜单
  const creatSubMenu = (data: any): any => {
    const menuItemList: any = []
    data?.routes?.map((item: MenuType) => {
      let arr = data?.routes?.filter((item: any) => !item.hidden)
      if (arr.length > 0) {
        menuItemList.push(renderMenu(item)) // 真正渲染菜单的地方
      }
      return arr
    })
    // console.log(getImageUrl(data.path), 'kkkkk')
    return menuItemList.length > 0 ? (
      <SubMenu key={data.key} className={`sub-menu-change ${isFold ? 'fold-styled' : ''}`}
        // icon={<img alt="" src={require(`@/assets/svg${data.path}.svg`)} />}getImageUrl
        icon={<img alt="" src={getImageUrl(data.path)} />}
        title={isFold ? '' : subMenuTitle(data)}>
        {menuItemList}
      </SubMenu>
    ) : null
  }

  // 创建菜单树 目录层
  const renderMenuMap = (list: CommonObjectType): JSX.Element[] => list.map(item => {
    return renderMenu(item)
  })

  // 判断是否有子菜单，渲染菜单层
  function renderMenu(item: MenuType) {
    return item.type === 'subMenu' ? creatSubMenu(item) : createMenuItem(item)
  }

  const setDefaultKey = flatMenu.filter((item: MenuType) => item.type === 'subMenu').reduce((prev: MenuType[], next: MenuType) => [...prev, next.key], [])

  const showKeys = document.body.clientWidth <= 1366 ? [] : setDefaultKey

  const onCollapse = (collapsed: boolean) => setStoreData('SET_COLLAPSED', collapsed)

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        overflow: 'auto',
        position: 'absolute',
        left: 0,
        background: '#002651',
        userSelect: 'none',
        paddingBottom: '120px',
      }}
      width={208}
    >
      <Menu defaultOpenKeys={showKeys} mode="inline" theme="dark" style={{ background: '#002651' }} onClick={handleClick}
        selectedKeys={[current]}>
        {renderMenuMap(menus)}
      </Menu>
    </Layout.Sider>
  )
}

export default connect(
  state => state,
  actions,
)(MenuView)
