import React, { FC } from "react"
import { Descriptions } from "antd"
import "./style.less"

const { Item } = Descriptions

interface Props {
  columns: any[],
  data: {},
  column?: number,
  title?: string,
  size?: "default" | "middle" | "small",
  span?:number
}

const columnObj = {
  1: 1,
  2: 6,
  3: 8,
  4: 10
}
// 详情卡片
const InfoCard: FC<Props> = ({ columns, data, column = 3, title, size }) => {
  return <Descriptions bordered column={8} title={title} size={size}>
    {
      columns && columns.map((column, index) => {
        const { title, dataIndex, render, color } = column
        let content = data[dataIndex]
        if (render) {
          content = render(data[dataIndex], data)
        }
        return (
          <Item key={index} label={<span style={{ color }}>{title}</span>} span={3}>
            {content}
          </Item>
        )
      })
    }

  </Descriptions>
}

export default InfoCard

