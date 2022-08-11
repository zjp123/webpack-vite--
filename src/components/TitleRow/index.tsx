import React, { ReactNode, memo, useRef, useLayoutEffect, useState } from 'react'
import './style.less'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Radio, Space } from 'antd'
// import style from '@/pages/Student/business/style.less'
export type TitleRowProps = {
    rightRender?: ReactNode
    title?: ReactNode | string
    subTitle?: string
    options?: ReactNode
    extraConfig?: ReactNode
    operate?: ReactNode
    isAutoChange?: boolean
    centerRender?: ReactNode
    centerData?: Array<any>
}

const TitleRow: React.FC<TitleRowProps> = (props) => {
    const { rightRender, title, subTitle, options, extraConfig, operate, centerRender } = props
    const centerRowRef = useRef(null)
    const [showNumber, setShowNumber] = useState(0)
    const handleResize = () => {
        setShowNumber(centerRowRef.current.clientWidth / (props.centerData.length + 100))
        autoHeader()
    }

    useLayoutEffect(() => {
        setShowNumber(centerRowRef.current.clientWidth / (props.centerData.length + 106))
    }, [])
    useLayoutEffect(() => {
        // 监听
        window.addEventListener('resize', handleResize)
        // 销毁
        return () => window.removeEventListener('resize', handleResize)
    })

    const autoHeader = () => {
        const radioList = []
        const menuList = []
        props.centerData.forEach((item, index) => {
            if (index <= showNumber) {
                radioList.push(item)
            } else {
                menuList.push(item)
            }
        })

        const menu = (
            <Menu>
                {menuList.map((item, index) => {
                    return (
                        <Menu.Item key={index}>
                            {item.typeName}({item.total})
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
        return (
            <>
                <Radio.Group defaultValue={1} buttonStyle="solid">
                    {radioList.map((item) => {
                        return (
                            <Radio.Button value={item.type} key={item.type}>
                                {item.typeName}({item.total})
                            </Radio.Button>
                        )
                    })}
                    {menuList.length > 0 && (
                        <Dropdown overlay={menu}>
                            <Button style={{ borderLeft: 'none' }}>...</Button>
                        </Dropdown>
                    )}
                </Radio.Group>
            </>
        )
    }

    return (
        <div className="row">
            <div className="titleLeft">
                <span className={typeof title === 'string' ? 'title' : ''}>{title}</span>
                {subTitle && (
                    <span className="subTitle">
                        <InfoCircleOutlined className="icon" />
                        {subTitle}
                    </span>
                )}
                {extraConfig}
            </div>
            <div className="centerRow" ref={centerRowRef}>
                {props.isAutoChange ? autoHeader() : centerRender}
            </div>
            <div className="rightRow">
                <Space>
                    <div className="right">{rightRender}</div>
                    {options && <div className="options">{options}</div>}
                    {operate && <div className="options">{operate}</div>}
                </Space>
            </div>
        </div>
    )
}

export default memo(TitleRow)
TitleRow.defaultProps = {
    isAutoChange: false,
    centerData: [],
}
