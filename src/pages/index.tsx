/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:44:50
 * @description: 系统首页结构拆分完毕
 */
import React from "react"
import { WhiteCard } from "@/components"
import SysIndex from "./IndexPage"

const IndexPage = () => {
  return (
    <WhiteCard isPaved={false} style={{ background: "#F9F9F9" }}>
      {/* <FaceRecognition  onChange={(res)=>{
        console.log(res,'res_Camera')
      }}/> */}
      {/* <Camera onChange={(res)=>{
        console.log(res,'res_Camera')
      }}/> */}
      {/* <CameraAutomatic onChange={(res)=>{
        console.log(res,'res_CameraAutomatic')
      }}/> */}
      <div className="index_page_container">
        <SysIndex/>
      </div>
    </WhiteCard>
  )
}
export default IndexPage
