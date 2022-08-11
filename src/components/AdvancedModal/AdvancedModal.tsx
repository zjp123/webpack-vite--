import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import './index.less'

export interface IProps {
  visible: boolean
  closeModal: () => void
  title: string
  onSubmit?: any
  onSave?: any
  showOnSave?: boolean
  footer?: JSX.Element
}

const AdvancedModal: FC<IProps> = ({ visible, closeModal, title, children, onSubmit, onSave, showOnSave = true, footer }) => {
  return (
    visible &&
    ReactDOM.createPortal(
      <div className="allocating-car-modal-wrapper" style={{ display: 'flex' }} onClick={closeModal}>
        {/*<div className="allocating-car-modal-wrapper" style={{ display: visible ? 'flex' : 'none' }} onClick={closeModal}>*/}
        <div className="allocating-car-modal-wrapper-body" onClick={e => e.stopPropagation()}>
          <div className="allocating-car-modal-wrapper-body-header">
            {title}
            <div className="close" onClick={closeModal}>
              ×
            </div>
            <div className="blue-border" />
          </div>
          {children}
          <div className="allocating-car-modal-wrapper-body-footer">
            <Button type="primary" onClick={onSubmit}>
              提交
            </Button>
            {showOnSave && <Button onClick={onSave}>保存草稿</Button>}
            {footer}
          </div>
        </div>
      </div>,
      document.body
    )
  )
}

export default AdvancedModal
