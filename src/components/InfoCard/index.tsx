/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-03-15 15:29:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/components/InfoCard/index.tsx
 */
import React, { CSSProperties, FC, useEffect, useState } from "react"
import { Tooltip } from 'antd'
import './index.less'

interface Props {
  columns: any[],
  data: {},
  title?: string,
  column?: number,
  size?: "default" | "middle" | "small",
  titleWidth?: string | number,
  contentWidth?: string | number,
  style?: CSSProperties | undefined
}

function arrTrans(num, arr) { // 一维数组转换为二维数组
  const iconsArr = []; // 声明数组
  arr.forEach((item, index) => {
    const page = Math.floor(index / num); // 计算该元素为第几个素组内
    if (!iconsArr[page]) { // 判断是否存在
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  while (iconsArr[iconsArr.length - 1].length < num) {
    iconsArr[iconsArr.length - 1].push({ title: "-", dataIndex: "null" })
  }
  return iconsArr;
}

const InfoCard: FC<Props> = (props) => {
  const { columns, data, title, column, size, titleWidth, contentWidth, style } = props
  const [autoColumn, setAutoColumn] = useState(column)
  let renderList = columns && columns.map((item, index) => {
    const content = data[item.dataIndex]
    const title = item.title
    const dataIndex = item.dataIndex
    const render = item.render
    return {
      title,
      content,
      dataIndex,
      render
    }
  })

  useEffect(() => {
    if (window.innerWidth < 1200) {
      setAutoColumn(2)
    }
  }, [])

  renderList = arrTrans(autoColumn, renderList)
  // console.log(document.getElementById('ddText'),document.getElementById('ddText')&&document.getElementById('ddText').clientHeight,89,document.body.clientHeight)

  return <div className={`info-card-div info-card-div-${size}`} style={{ ...style }}>
    {
      renderList?.map((items: any, index) => {
        return <dl key={index}
          className={`info-card-row ${items.length < autoColumn ? 'info-card-row' + items.length : ''}`}>
          {
            items?.map((item_, index) => {
              const { title, dataIndex, render, color } = item_
              let content = data[dataIndex]
              if (render) {
                content = render(data[dataIndex], data)
              }
              return <div key={index} style={{ display: 'flex' }}>
                <dt style={{ width: typeof titleWidth === 'number' ? titleWidth + 'px' : titleWidth, minWidth: '124px', justifyContent: 'center'}}
                  className={`info-card-dl-${size}`}>{typeof title === 'string' ? title : title(data[dataIndex], data)}</dt>
                <dd style={{ width: typeof contentWidth === 'number' ? titleWidth + 'px' : contentWidth }}
                  className={`info-card-dd-${size} ${content&&content.length>46&&'tableValue'}` }>
                    {content&&content.length>46? <Tooltip placement="bottomLeft" title={content}><div >{content}</div></Tooltip>:content}
                    {/* tableValue */}
                     {/* <Tooltip placement="bottomLeft" title={content}><div >{content}</div></Tooltip> */}
                    </dd>
              </div>
            })
          }
        </dl>
      })
    }
  </div>
}

InfoCard.defaultProps = {
  column: 4,
  size: "default",
  titleWidth: '40%',
  contentWidth: '60%'
}

export default InfoCard
