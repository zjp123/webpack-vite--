/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-19 16:35:22
 * @description: 通知组件
 */
 import { notification } from "antd"

 /**
  * @param config antd 的notification配置
  * @param type 消息通知类型
  * @param showBtn 是否显示自定义按钮
  */
 export const openNotification = (config, type: string = "info", showBtn?: boolean) => {
   const {placement, duration, message, description, btn} = config
   const key = `open${Date.now()}`;
 
   config = {
     placement: placement || "topRight", // 默认在右上角通知
     duration: duration || 3.5,
     message: message || "",
     description: description || "",
     key,
     btn: showBtn && btn,
   }
   const info = () => {
     notification.info(config)
   }
 
   const success = () => {
     notification.success(config)
   }
   const error = () => {
     notification.error(config)
   }
   const warning = () => {
     notification.warning(config)
   }
   const warn = () => {
     notification.warn(config)
   }
   const open = () => {
     notification.open(config)
   }
   const close = () => {
     notification.close(key)
   }
   const destroy = () => {
     notification.destroy()
   }
 
   const notifyArr = [{info}, {success}, {error}, {warning}, {warn}, {open}, {close}, {destroy}]
   const notifyObj = notifyArr.find((item) => Object.keys(item) && Object.keys(item)[0] === type)
   Object.values(notifyObj)[0] && Object.values(notifyObj)[0]()
 }
 