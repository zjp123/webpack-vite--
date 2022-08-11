import React, { FC, ReactElement } from 'react'

export interface ItemIProps {
  title?: string | null | JSX.Element
  Editor?: JSX.Element
}

const AdvancedModalItem: FC<ItemIProps> = ({ title = null, children, Editor }) => {
  return (
    <div className="allocating-car-modal-wrapper-body-content">
      {title && <div className="allocating-car-modal-wrapper-body-content-title">{title}</div>}
      {Editor ? Editor : <div className="allocating-car-modal-wrapper-body-content-body">{children}</div>}
    </div>
  )
}

export default AdvancedModalItem
