/**
 * author: 于天翔
 * DownloadButton:
 *    downloadApi: 传入封装好的api函数
 *    例: export function batchDownload(data = {}) {
          return request.downloadZip(`/archives/batchDownload/release`, data)
      }
 *    paramsName: 该接口需要传入的下载队列的字段名
 *    例: batchDownload({ ----> studentIds <----- : checkedList})
 *    params: 可选参数，该接口需要传入的其他参数
 * CheckedAllButton:
 *    list: 数据列表
 *    itemName: 需要从数据列表中拿出的字段
 * CheckedButton:
 *    value: 传入columns的render中每一项的值
 *    例: render: (text, record, index) => {
            return <>
              <CheckedButton value={record?.studentId}/>
              <span style={{ marginLeft: '10px' }}>
                {(searchInformationForm.pageNum - 1) * searchInformationForm.pageSize + index + 1}
              </span>
            </>
          }
 * 注: !!!!!!使用批量下载的组件在组件卸载前要重置dva状态管理中的批量下载列表:
 * useEffect(() => {
      return function cleanup() {
        dispatch({
          type: 'global/resetBatchDownload'
        })
      }
    })
 */

import DownloadButton from "@/components/BatchDownload/DownloadButton";
import CheckedAllButton from "@/components/BatchDownload/CheckedAllButton";
import CheckedButton from "@/components/BatchDownload/CheckedButton";

export {
  DownloadButton,
  CheckedAllButton,
  CheckedButton
}
