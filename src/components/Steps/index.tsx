import React, {FC, useEffect, useMemo, useRef, useState} from "react";
import point from '@/assets/svg/point.svg'
import grayPoint from '@/assets/svg/grayPoint.svg'
import U from '@/assets/svg/U.svg'
import grayU from '@/assets/svg/grayU.svg'
import './index.less'

interface ISteps {
  current: number
  data: {
    code: string
    name: string
  }[]
}

const Steps: FC<ISteps> = ({current, data}) => {
  const stepsBox = useRef<HTMLDivElement>(null)
  const [innerWidth, setInnerWidth] = useState(stepsBox.current?.clientWidth)
  const itemWidth = useMemo(() => 100, [])
  const mapList = useMemo(() => {
    if (data && data.length > 0) {
      return data.reduce(
        (
          pre,
          current,
          index
        ) => {
          if (index === 0) {
            return [[current]]
          }
          if ((pre[pre.length - 1].length + 1) * itemWidth < innerWidth) {
            pre[pre.length - 1].push(current)
          } else {
            pre.push([current])
          }
          return pre
        }, [])
    }
  }, [data, innerWidth])
  const initMapList = (list: Array<{ code: string, name: string }>[]) => {
    if (list && list.length > 0) {
      return list.map((item, index) => {
        return index % 2 === 1 ? [...item].reverse() : item
      })
    }
  }

  useEffect(() => {
    setInnerWidth(stepsBox.current?.clientWidth)
    window.addEventListener('resize', () => {
      setInnerWidth(stepsBox.current?.clientWidth)
    })
  }, [stepsBox.current, innerWidth])

  const Item = ({key, children}) => {
    return <div key={key} className="steps-item" style={{width: itemWidth + 'px'}}>
      {children}
    </div>
  }

  const isStepIn = (mapList: Array<any>, index: number, i: number) => {
    let currentAddress
    // 如果不超过两行 不需要考虑行数
    // 如果在第一行 不需要考虑行数
    if (index === 0) {
      currentAddress = i
    } else {
      // 如果超过两行
      // 首先判断当前再第几行
      // currentRow = index + 1
      // 之前的行数与一行的个数相乘 加上 当前行内的索引 求出目前所在的位置
      currentAddress = index * mapList[0].length + i
    }

    return currentAddress <= current
  }

  const addDownLine = (mapList, index, item, i) => {
    let reverseI = index % 2 === 1 ? reverseIndex(item, i) : i
    const icon = isStepIn(mapList, index, reverseI + 1) ? U : grayU
    // 如果不超过两行 不需要下横线
    if (mapList.length < 1) {
      return
    }
    // 如果超过两行
    // 判断当前行有没有下一行
    if (index === mapList.length - 1) {
      // 如果是最后一行 不需要下横线
      return;
    } else {
      // 如果还有下一行
      // 判断是奇数行还是偶数行
      if (index % 2 === 1) {
        // 奇数行
        // 奇数行判断
        // 第一个元素添加下横线
        if (i === 0) {
          return <img className="down-line" src={icon} alt=""/>
        }
      } else {
        // 偶数行
        // 最后一个元素添加下横线
        if (i === item.length - 1) {
          return <img className="down-line" src={icon} alt=""/>
        }
      }
    }
  }

  const reverseIndex = (list, index) => {
    return list.length - index - 1
  }

  return <div className="steps" ref={stepsBox}>
    <div className="steps-container"
         style={{
           width: mapList && mapList?.length > 0
             ? itemWidth * mapList[0]?.length + 'px'
             : 0
         }}
    >
      {
        initMapList(mapList)?.map((item, index) => {
          return <div
            className="steps-row"
            style={{
              justifyContent: index % 2 === 1 ? 'flex-end' : 'flex-start'
            }}
          >
            {
              item?.map(({code, name}, i) => {
                let reverseI = index % 2 === 1 ? reverseIndex(item, i) : i
                let reverseRightI = index % 2 === 1 ? reverseIndex(item, i) : i + 1

                return <Item key={code}>
                  <div className="steps-icon">
                    <img src={isStepIn(mapList, index, reverseI) ? point : grayPoint} alt=""/>
                    {
                      i < item.length - 1 &&
                      <div className={`right-line ${isStepIn(mapList, index, reverseRightI) ? '' : 'gray'}`}/>
                    }
                    {addDownLine(mapList, index, item, i)}
                  </div>
                  {name}
                </Item>
              })
            }
          </div>
        })
      }
    </div>
  </div>
}

export default Steps
