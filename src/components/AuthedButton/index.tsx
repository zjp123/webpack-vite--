import React from 'react'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'

// admin 的 权限码 permissions: ["*:*:*"]
const AuthedButton = props => {
  const {
    storeData: { permissions: authCodeArrOrString },
    hasPermission
  } = props
  // console.log('child', authCodeArrOrString, hasPermission, hasPermission === '*:*:*')
  return authCodeArrOrString.includes('*:*:*') || authCodeArrOrString.includes(hasPermission) ? props.children : null
}

export default connect(
  state => state,
  actions
)(AuthedButton)
