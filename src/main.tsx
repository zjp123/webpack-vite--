// ie polyfill
import "./polyfill"
import "react-app-polyfill/ie9"
import "react-app-polyfill/stable"
import "core-js/es"
import "mutation-observer"
// import React from "react"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/lib/integration/react"
import { createHashHistory } from "history"
import { registerHistoy } from "@/utils/router"
import { store, persistor } from "@/store"
import createLoading from "dva-loading"
import { ConfigProvider } from "antd"
import zhCN from "antd/es/locale/zh_CN"
import moment from "moment"
import "moment/locale/zh-cn"
import App from "./App"
import dva from "dva"
import "./global.less"
import "./index.css"

// import "@/mock/index"
// const globalModel = import.meta.glob('./models/global', { import: 'default' })
import globalModel from "@/models/global";

moment.locale("zh-cn")
//全局样式
// Initialize
export const app = dva({
  history: createHashHistory(),
  onError: (err) => {
  }
})
app.use(createLoading())
// app.model(require("./models/global").default)
// console.log(globalModel, 'globalModel.defaultglobalModel.default')
app.model(globalModel)

// 3. Register global model
app.router((props) => {
  registerHistoy(props.history) // 注册history对象
  return <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={zhCN}>
        <App {...props} />
      </ConfigProvider>
    </PersistGate>
  </ReduxProvider>
})
//Start
app.start("#root")
