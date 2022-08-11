import React, { FC } from "react"
import { Router, Redirect, Route } from "react-router-dom"
import Login from "@/pages/Login"
import * as actions from '@/store/actions'
import { connect } from 'react-redux'
import Container from "@/pages/Container"

interface AppProps {
  app: any
  history: any

  [p: string]: any
}

const App: FC<AppProps> = (props) => {
  let {history} = props

  const {
    storeData: {userInfo},
  } = props
  const {token} = userInfo

  return (
    <div>
      <Router history={history}>
        <Route exact path="/login" component={Login}/>
        <Route
          path="/"
          render={() => {
            if (!token) {
              return <Redirect from="/" to="/login"/>;
            } else {
              return <Container {...props}/>
            }
          }}
        />
      </Router>
    </div>
  )
}

export default connect(
  state => state,
  actions,
)(App)
