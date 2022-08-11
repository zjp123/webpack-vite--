import { replaceKey } from "@/utils"
import formatterMenusGetModels from "./config"

// @ts-ignore
export const deleteHidden = (catalogue) => {
  const menus = JSON.parse(JSON.stringify(catalogue))
  return menus.filter((item) => {
    if (item.routes && item.routes.length) {
      item.routes = deleteHidden(item.routes)
    }
    return !item.hidden
  })
}

/**
 * @param routes 接口获取的路由菜单
 */
export const getFormattedMenus = (routes = [], isDelete = true) => {

  // debugger
  // 1. 格式化接口菜单, 添加 models, component 和 exact
  const formattedMenusGetModels = formatterMenusGetModels(routes) || []
  // 2. 替换菜单中 code 值, 把 code 转换成 => key
  const replacedMenusCode = replaceKey(formattedMenusGetModels, "code", "key")
  // 3. 替换菜单 children 值, 把 children 替换成 routes, 未扁平化处理
  const replacedMenusChildren = replaceKey(replacedMenusCode, "children", "routes")
  // 4. 删除隐藏菜单 isDelete 为 true, 删除hidden 为 true的菜单,  否则不删除
  const menus = isDelete ? deleteHidden(replacedMenusChildren) : replacedMenusChildren
  return {
    // 替换 code 和 key / children 和 routes 之后的菜单. 未扁平化
    menus: replacedMenusChildren,
    // 删除了 hidden 未 true 的菜单
    catalogueMenus: menus,
  }
}
