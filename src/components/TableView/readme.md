展示列、导出列

<TableView
    pageProps={{
        getPageList: getData,
        pagination: pageList.pagination,
    }}
    titleProps={{
        title: '车辆信息',
        rightRender: headerBtn(),
    }}
    dataSource={pageList.list}
    search={searchForm()}
    columns={getActiveItem(columns(pageList.pagination, operate, header, showHeader))}
    rowKey="id"
    loading={loading}
    // 是否显示展示列
    colSetting={true} 
    // 展示列改变回调 返回值为改变后的数组
    colChange={setShowHeader} 
    // 展示列的数据 header 为后台传给前端的动态列，showHeader 为展示列改变后的数据
    colColumns={columns(pageList.pagination, operate, header, showHeader)} 
    // 是否显示导出列
    exportSetting={true}
    // 是否显示导出列 localExportColumns 为本地的导出列  exportColumns 为改变后的导出列
    exportColumns={handleExportColumns(localExportColumns, exportColumns)}
    // 展示列改变回调 返回值为改变后的数组
    exportChange={exportChange}
    // 本地存储的重要字段，需要保持唯一性，建议使用模块名字
    tableKey="carInfo"
/>

// 表格列为动态添加，保证列的最新结果
const handleHeader = (a = [], b = []) => {
    let localList: any = cloneDeep(a)
    let baseList: any = cloneDeep(b)
    for (let i = localList.length - 1; i >= 0; i--) {
        let isHas = false
        let item = localList[i]
        for (let j = baseList.length - 1; j >= 0; j--) {
            let item1 = baseList[j]
            if (item.title === item1.title) {
                isHas = true
                item.render = item1.render
                baseList.splice(j, 1)
            }
        }
        // 如果不是动态的，可以省略
        if (!isHas) {
            localList.splice(i, 1)
        }
    }
    // 如果不是动态的，可以省略
    if (baseList.length) {
        baseList.forEach((item: any) => {
            localList.splice(localList.length - 3, 0, item)
        })
        
    }
    return localList
}
