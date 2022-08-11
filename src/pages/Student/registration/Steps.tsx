/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 13:27:29
 * @description: 公共进度条
 */

import React, { Fragment, useEffect } from "react"
import { connect } from "dva"
import { Dsteps } from "@/components"
import { Card } from "antd"
import "./index.less"

interface IStepsProps {

}

// 进度条
const Steps = ({ dispatch, currentStep }) => {
  const stageInfoTit = ["身份证照片采集", "证件照片采集", "体检信息", "机动车驾驶证申请表", "完成"]
  // const [currentStep, setCurrentStep] = useState(0) // 当前步骤

  useEffect(() => {
  }, [])

  const dstepsArray = stageInfoTit.map((item, index) => {
    return {
      name: item,
      // description: stageInfoArray[index] ? stageInfoArray[index].schName + stageInfoArray[index].registrationTime : null
    }
  })

  return (
    <Fragment>
      <Card>
        <div className="steps">
          <Dsteps title=" " current={currentStep} data={dstepsArray} />
        </div>
      </Card>
    </Fragment>
  )
}
export default connect(({ registration, global }) => {
  return {
    isShowShootIDCard: registration.isShowShootIDCard,
    isShowInputForm: registration.isShowInputForm,
  }
})(Steps)

