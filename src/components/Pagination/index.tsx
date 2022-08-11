import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd'

type PaginationProps = {
    pagination: PaginationItem;
    getPageList: (args: Result.pageInfo) => void;
    showQuickJumper?: boolean; // 是否可以快速跳转至某页
    showSizeChanger?: boolean; // 是否展示 pageSize 切换器
    pageSizeOptions?: string[]; // 指定每页可以显示多少条
    islocalStorage?: boolean; //是否把pageSize储存在localStorage
    style?: any
}

type PaginationItem = {
    pageNum: number; // 当前页
    pageSize: number; // 每页条数
    totalPages?: number; // 总页数
    totalRows?: number; // 总条数
}

const JxtPagination: React.FC<PaginationProps> = (props) => {
    const jxt_page = Number(localStorage.getItem('jxt_page'))
    const { getPageList, pagination, showQuickJumper, showSizeChanger, pageSizeOptions, islocalStorage, style } = props
    const [newPageSize] = useState<number>(jxt_page || pagination.pageSize)
    // 页码改变
    useEffect(() => {
        pagination.pageSize = newPageSize
    }, [newPageSize])

    const onchange = () => {
        const pageInfo = {
            pageNum: pagination.pageNum,
            pageSize: pagination.pageSize
        }
        getPageList(pageInfo)
    }

    return (
        <Pagination
            total={pagination.totalRows}
            current={pagination.pageNum}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            showQuickJumper={showQuickJumper}
            showSizeChanger={showSizeChanger}
            pageSizeOptions={pageSizeOptions}
            style={{
                paddingTop: 15,
                ...style
            }}
            onChange={(page, pageSize = 10) => {
                pagination.pageNum = page
                pagination.pageSize = pageSize
                islocalStorage && localStorage.setItem('jxt_page', `${pageSize}`)
                onchange()
            }}
            onShowSizeChange={(current, size = 10) => {
                pagination.pageNum = 1
                pagination.pageSize = size
                islocalStorage && localStorage.setItem('jxt_page', `${size}`)
                onchange()
            }}
        />
    )
}

JxtPagination.defaultProps = {
    pagination: {
        pageNum: 1, // 当前页
        pageSize: 30, // 每页条数
        totalRows: 0 // 总条数
    },
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '30', '50', '100'],
    islocalStorage: true
}

export default JxtPagination
