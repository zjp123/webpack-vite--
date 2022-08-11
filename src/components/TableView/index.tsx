import { ReactNode, useEffect, useMemo, useRef, useState, useImperativeHandle, useCallback } from 'react'
import React from 'react'
import { Space, Table, Tooltip } from 'antd'
import { TitleRowProps } from '@/components/TitleRow'
import { ReadCard, TitleRow, Pagination } from '@/components'
import './style.less'
import { TableProps } from 'antd/lib/table'
import { RetweetOutlined, IdcardOutlined } from '@ant-design/icons'
import { Resizable } from 'react-resizable'
import classnames from 'classnames'
import style from "./style.less"

type PaginationItem = {
    pageNum: number // 当前页
    pageSize: number // 每页条数
    totalPages?: number // 总页数
    totalRows?: number // 总条数
}

type pageProps = {
    pagination: PaginationItem
    getPageList: (data: Result.pageInfo) => void
}

type Props = {
    sticky?: boolean
    summary?: () => ReactNode
    isSummary?: boolean //是否固定页脚
    changeCbk?: (a, b, c) => void  //change函数
    isChangeCbk?: boolean  //是否绑定change函数
    hasPagination?: boolean //按钮设置有无
    showTitle?: boolean
    pageProps?: pageProps
    search?: ReactNode
    titleProps?: TitleRowProps
    fixHeight?: boolean
    colSetting?: boolean
    viewChange?: () => void
    viewChangeSetting?: boolean
    colColumns?: any[]
    baseColumns?: any[]
    colChange?: (list: []) => void
    exportSetting?: boolean
    exportColumns?: any[]
    exportBaseColumns?: any[]
    exportChange?: (list: []) => void
    rowKey?: (string)
    isAutoColumns?: boolean
    noPadding?: boolean
    getRowData?: (record) => void  //返回当前选中行的数据
    isSelection?: boolean //列表多选
    getSelection?: (list: [], itemList: any[]) => void //返回选中的ID
    selectHeight?: boolean // 选中高亮
    customElement?: ReactNode // 自定义元素
    tableRef?: any
    extraHeight?: number // 需调整的额外高度
    isShowArrearage?: boolean // 是否标示欠费行
    readIDCardSetting?: boolean //控制读取身份证
    readIDCard?: (obj: any) => void //点击读取身份证回调
    isIDCardCbk?: boolean   //身份证读取多时切换回调
    tableHeight?: string
} & TableProps<any>

const defaultPageProps = {
    pagination: {
        pageNum: 1, // 当前页
        pageSize: 30, // 每页条数
        totalRows: 0 // 总条数
    },
    getPageList: () => {
    }
}

/**
 * 获取所有子集
 * @param  {Array}  array    待被解析的数组
 * @param  {String} children 子集的key  默认为 children
 * @return {Array}           解析完的数组
 */
const getDataList = (array = [], children = 'children') => {
    let result = [];
    array.forEach((item) => {
        result.push(item);
        if (item[children]) {
            let childs = getDataList(item[children]);
            result.push(...childs);
        }
    });
    return result;
}

const JxtTableView: React.FC<Props> = ({ columns, ...props }) => {
    const page = props.hasPagination
        ? { ...defaultPageProps, ...props.pageProps }
        : {
            pagination: {
                pageNum: 1, // 当前页
                pageSize: 30, // 每页条数
                totalRows: 0 // 总条数
            },
            getPageList: () => {
            }
        }

    const searchBox = useRef<HTMLDivElement>(null)
    const [maxHeight, setMaxHeight] = useState(600)
    const [autoColumns, setAutoColumns] = useState([])

    // const handleResize = (index) => (e, { size }) => {
    //     const nextColumns = [...tempColumns]
    //     nextColumns[index] = {
    //         ...nextColumns[index],
    //         width: size.width
    //     }
    //     setAutoColumns(nextColumns)
    // }
    // const tempColumns = useMemo(() => {
    //     return columns.map((col, index) => ({
    //         ...col,
    //         onHeaderCell: (column) => ({
    //             width: column.width,
    //             onResize: handleResize(index)
    //         })
    //     }))
    // }, [columns, handleResize])

    const handleResize = useCallback((index) => (e, { size }) => {
        const nextColumns = [...tempColumns]
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width
        }
        setAutoColumns(nextColumns)
    }, [columns])

    const tempColumns = useMemo(() => {
        return columns && columns.map((col, index) => {
            return ({
                ...col,
                onHeaderCell: (column) => ({
                    width: column.width,
                    onResize: handleResize(index)
                })
            })
        })
    }, [handleResize])

    const rowSelection = {
        onChange: (selectedRowKeys, record) => {
            const { rowKey, dataSource } = props;
            const dataList = getDataList(dataSource as any);
            // checkbox情况
            let idx = selectedRowKeys.indexOf(record[rowKey]),
                selectKeys = [],
                selectRows = [];
            if (idx > -1) {
                // 已经存在
                selectKeys = [...selectedRowKeys];
                selectKeys.splice(idx, 1);
                selectRows = dataList.filter((data) => selectKeys.includes(data[rowKey]));
            } else {
                // 不存在
                selectKeys = [...selectedRowKeys, record[rowKey]];
                selectRows = dataList.filter((data) => selectKeys.includes(data[rowKey]));
            }
            props.getSelection(selectedRowKeys, selectRows)
        }
    }

    useEffect(() => {
        changeMaxHeight()
    }, [searchBox, props.search])

    // 改变表格最大高度
    const changeMaxHeight = () => {
        const newSearchBox = searchBox as any
        setMaxHeight(document.documentElement.clientHeight - (newSearchBox.current.clientHeight + 295) - (props.extraHeight || 0))
        return
    }

    // 隔行变色
    const rowClassName = (record: any = {}, index: number) => {
        let className = 'light-row'
        if (index % 2 === 1) className = 'dark-row'
        if (props.isShowArrearage && record.arrearageFee) {
            className = 'arrearage-row'
        }
        if (props.selectHeight && index === selectRow) {
            className = 'select-row'
        }
        if (hoverRow === index) {
            className = 'hover-row'
        }
        return className
    }
    const [selectRow, setSelectRow] = useState(null)
    const [hoverRow, setHoverRow] = useState(null)

    // 操作列（展示列、导出列）
    const operateOptions = () => {
        if (props.colSetting || props.exportSetting || props.viewChangeSetting) {
            return (
                <Space>
                    {props.viewChangeSetting && (
                        <>
                            <Tooltip placement="top" title="视图切换">
                                <RetweetOutlined
                                    onClick={() => {
                                        props.viewChange && props.viewChange()
                                    }}
                                    className="table-operate-icon"
                                />
                            </Tooltip>
                        </>
                    )}
                    {props.readIDCardSetting && (
                        <>
                            <Tooltip placement="top" title="读取身份证">
                                <div className={style.readIDCard}>
                                    <div className={style['readIDCard-btn']}>
                                        {
                                            !props.isIDCardCbk && <ReadCard
                                                onReaded={(data) => {
                                                    let obj = {
                                                        idcard: data.idcard || null,
                                                    }
                                                    props.readIDCard && props.readIDCard(obj)
                                                }}
                                            />
                                        }
                                    </div>
                                    <IdcardOutlined
                                        className="table-operate-icon"
                                    />
                                </div>
                            </Tooltip>
                        </>
                    )}
                </Space>
            )
        } else {
            return false
        }
    }

    const ResizableTitle = (props) => {
        const { onResize, width, ...restProps } = props

        // 添加偏移量
        const [offset, setOffset] = useState(0)

        if (!width) {
            return <th {...restProps} />
        }

        return (
            <Resizable
                // 宽度重新计算结果，表头应当加上偏移量，这样拖拽结束的时候能够计算结果；
                // 当然在停止事件再计算应当一样，我没试过（笑）
                width={width + offset}
                height={0}
                handle={
                    <span
                        // 有偏移量显示竖线
                        className={classnames(['react-resizable-handle', offset && 'active'])}
                        // 拖拽层偏移
                        style={{ transform: `translateX(${offset}px)` }}
                        onClick={(e) => {
                            // 取消冒泡，不取消貌似容易触发排序事件
                            e.stopPropagation()
                            e.preventDefault()
                        }}
                    />
                }
                // 拖拽事件实时更新
                onResize={(e, { size }) => {
                    // 这里只更新偏移量，数据列表其实并没有伸缩
                    setOffset(size.width - width)
                }}
                // 拖拽结束更新
                onResizeStop={(...args) => {
                    // 拖拽结束以后偏移量归零
                    setOffset(0)
                    // 这里是props传进来的事件，在外部是列数据中的onHeaderCell方法提供的事件，请自行研究官方提供的案例
                    onResize(...args)
                }}
                draggableOpts={{ enableUserSelectHack: false }}
            >
                <th {...restProps} />
            </Resizable>
        )
    }

    const components = {
        header: {
            cell: ResizableTitle
        }
    }

    useEffect(() => {
        setAutoColumns(tempColumns)
    }, [tempColumns])

    useImperativeHandle(props.tableRef, () => ({
        // changeVal 就是暴露给父组件的方法
        changeVal: () => {
            setSelectRow({})
        }
    }))
    return (
        <div className="container" style={{height: props?.tableHeight || '100%'}}>
            <div ref={searchBox} className={props.search ? 'searchContainer' : ''}>
                {props.search}
            </div>
            <div className={props.noPadding ? '' : 'tableContainer'}>
                {props.showTitle && <TitleRow {...props.titleProps} operate={operateOptions()} />}
                {props.customElement && <div style={{ marginBottom: '7px', fontWeight: 500, fontSize: '16px' }}>{props.customElement}</div>}
                <Table
                    style={{ flex: 1 }}
                    rowClassName={rowClassName}
                    sticky={props.sticky}
                    components={components}
                    rowSelection={props.isSelection ? rowSelection : null}
                    scroll={props.fixHeight ? { y: maxHeight } : {}}
                    columns={props.isAutoColumns ? autoColumns : columns}
                    onChange={props.isChangeCbk ? props.changeCbk : () => { }}
                    onRow={(record, i) => {
                        return {
                            onClick: () => {
                                if (selectRow === i) {
                                    //获取选中行数据
                                    setSelectRow({})
                                    props.getRowData && props.getRowData({ ...record, isRepeat: true })
                                } else {
                                    //获取选中行数据
                                    setSelectRow(i)
                                    props.getRowData && props.getRowData({ ...record, isRepeat: false })
                                }
                            }, // 点击行
                            onMouseEnter: () => {
                                setHoverRow(i)
                            }, // 鼠标移入行
                            onMouseLeave: () => {
                                setHoverRow(null)
                            }
                        }
                    }}
                    {...props}
                />
                {props.hasPagination && <Pagination pagination={page.pagination} getPageList={page.getPageList} />}
            </div>
        </div>
    )
}

JxtTableView.defaultProps = {
    sticky: false,
    isSummary: false,
    isChangeCbk: false,
    hasPagination: true,
    showTitle: true,
    search: undefined,
    columns: [],
    dataSource: [],
    bordered: false,
    pagination: false,
    noPadding: false,
    fixHeight: true,
    size: 'small',
    colSetting: false,
    viewChange: () => {
    },
    viewChangeSetting: false,
    readIDCard: () => {
    },
    readIDCardSetting: false,
    exportSetting: false,
    isAutoColumns: false,
    exportColumns: [],
    exportBaseColumns: [],
    exportChange: () => {
    },
    rowKey: '',
    isSelection: false,
    getSelection: () => {
    },
    selectHeight: false,
    isShowArrearage: false
}

export default JxtTableView
/**
 *
 * <TableView
 *      {其他 Table 所支持的参数}
 search={searchForm()} 查询表单
 titleProps={{ 表格标题行参数
            subTitle: '', 子标题
            title: '标题', 标题 可为字符串和 ReactNoNde
            rightRender: btns(), 右边内容
            options:  按钮右边配置项为 ReactNode
        }}
 />
 */
