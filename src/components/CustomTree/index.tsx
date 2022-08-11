import React, {useCallback, useEffect} from "react";
import {Tree} from 'antd'
import {CheckInfo, Key, EventDataNode, DataNode} from "./interface"

interface CustomTreeProps {
  setCheckedKeys: React.Dispatch<React.SetStateAction<React.Key[]>>
  onExpand: (expandedKeys: React.Key[]) => void,
  expandedKeys: Key[],
  autoExpandParent: boolean,
  onCheck: (checked: {
    checked: Key[];
    halfChecked: Key[];
  } | Key[], info: CheckInfo) => void,
  checkedKeys: Key[],
  onSelect: (selectedKeys: Key[], info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }) => void,
  selectedKeys: Key[],
  treeData: DataNode[]
}

const CustomTree: React.FC<CustomTreeProps> = ({
                                                 setCheckedKeys,
                                                 onExpand,
                                                 expandedKeys,
                                                 autoExpandParent,
                                                 onCheck,
                                                 checkedKeys,
                                                 onSelect,
                                                 selectedKeys,
                                                 treeData
                                               }) => {
  useEffect(() => {
    if (checkedKeys.length > 0) {
      for (let i = 0; i < checkedKeys.length; i++) {
        const ancestors = searchAncestors(treeData, checkedKeys[i], [])
        replenishSelectedKeys(ancestors)
      }
    }
  }, [checkedKeys])

  const searchAncestors = useCallback((
    treeData: DataNode[], key: Key, ancestors: Key[]
  ) => {
    let res: Key[] = []
    for (let i = 0; i < treeData.length; i++) {
      const item = treeData[i]
      if (item.key === key) {
        return ancestors
      } else if (!item.children || item.children.length <= 0) {
      } else {
        res = searchAncestors(item.children, key, [...ancestors, item.key])
        if (res.length > 0) {
          break
        }
      }
    }
    return res
  }, [])

  const replenishSelectedKeys = (keys: Key[], type: "ADD" | "DELETE" = "ADD") => {
    if (keys.length <= 0) {
      return
    }
    keys.forEach(key => {
          if (!checkedKeys.includes(key)) {
            setCheckedKeys([...checkedKeys, key])
          }
    })
  }

  const enhanceOnCheck: typeof onCheck = (checked, info) => {
    const checkedKeysValue = info.checked ? addAncestors(checked, info) : deleteChildren(checked, info)
    onCheck(checkedKeysValue, info)
  }

  const searchChildren = (node: DataNode, allChildren = []) => {
    if (node.children.length > 0) {
      let all = []
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        const res = searchChildren(child, [...allChildren, child.key])
        all = [...all, ...res]
      }
      return all
    } else {
      return allChildren
    }
  }

  const deleteChildren = (checked, info: CheckInfo) => {
    let checkedKeysValue = checked
    const children = searchChildren(info.node)
    children.forEach(childKey => {
      if (getCheckedKeysChecked().includes(childKey)) {
        checkedKeysValue.checked = checkedKeysValue.checked.filter(k => k!==childKey)
      }
    })
    return checkedKeysValue
  }

  const addAncestors = (checked, info: CheckInfo) => {
    let checkedKeysValue = checked
    const ancestors = searchAncestors(treeData, info.node.key, [])
    ancestors.forEach(ancestorKey => {
      if (!getCheckedKeysChecked().includes(ancestorKey)) {
        checkedKeysValue.checked = [...checkedKeysValue.checked, ancestorKey]
      }
    })
    return checkedKeysValue
  }

  const getCheckedKeysChecked = () => {
    if((checkedKeys as any).checked) {
      return (checkedKeys as any).checked
    } else {
      return checkedKeys
    }
  }

  return <Tree
    checkable
    checkStrictly
    onExpand={onExpand}
    expandedKeys={expandedKeys}
    autoExpandParent={autoExpandParent}
    onCheck={enhanceOnCheck}
    checkedKeys={checkedKeys}
    onSelect={onSelect}
    selectedKeys={selectedKeys}
    treeData={treeData}
  />
}

export default CustomTree
