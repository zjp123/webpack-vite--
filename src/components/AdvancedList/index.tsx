import React, { FC, useEffect, useState, useMemo } from 'react'
import OneForm from './oneForm'
import { DictTypesInterface } from './itemInterface'
import './index.less'
import { Spin } from 'antd'
import { connect } from 'dva'

interface AdvancedListProps {
  title?: string
  virtualArchiveConfigList?: any[]
  dictTypes?: DictTypesInterface
  removeOneOfVirtualArchiveConfigList?: any
  removeOneOfDetails?: any
  addOneOfDetails?: any
  updateMyStatus?: any
  loading?: boolean
  updateData?: any
  updateVirtualArchiveConfigListOfOne?: any
}

const AdvancedList: FC<AdvancedListProps> = ({
  title,
  virtualArchiveConfigList,
  dictTypes,
  removeOneOfVirtualArchiveConfigList,
  removeOneOfDetails,
  addOneOfDetails,
  loading,
  updateMyStatus,
  updateData,
  updateVirtualArchiveConfigListOfOne
}) => {
  const DataList = () => {
    return (
      <>
        {virtualArchiveConfigList.map((item, index) => {
          return (
            <OneForm
              key={index}
              data={item}
              index={index}
              dictTypes={dictTypes}
              removeOneOfVirtualArchiveConfigList={() => removeOneOfVirtualArchiveConfigList(index)}
              removeOneOfDetails={childIndex => removeOneOfDetails(index, childIndex)}
              addOneOfDetails={formData => addOneOfDetails(index, formData)}
              updateMyStatus={() => updateMyStatus(index)}
              updateData={updateData}
              updateVirtualArchiveConfigListOfOne={updateVirtualArchiveConfigListOfOne}
            />
          )
        })}
      </>
    )
  }

  return <div className={loading ? 'advanced-list-loading' : ''}>{loading ? <Spin /> : <DataList />}</div>
}

export default connect(({ archiveConfig }) => ({
  virtualArchiveConfigList: archiveConfig.virtualArchiveConfigList
}))(AdvancedList)
