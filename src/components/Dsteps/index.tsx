import React, {forwardRef, FC, useState, useEffect, useRef} from "react"
import { Steps } from "antd"
import './index.less'

const { Step } = Steps

interface itemProps {
  name: string
  code?: any
}

interface DstepsProps {
  title?: string
  current?: number
  data: itemProps[]
}

const Dsteps: FC<DstepsProps> = forwardRef(
  (props: DstepsProps, ref: RefType) => {
    const stepsBox = useRef<HTMLDivElement>(null)
    const [innerWidth, setInnerWidth] = useState(stepsBox.current?.clientWidth)
    const listWidth = 158 * props.data.length
    useEffect(() =>{
      setInnerWidth(stepsBox.current?.clientWidth)
    },[stepsBox.current])
    return (
      <div ref={stepsBox} style={{ margin: "30px 0" }}>
        <h3 style={{ margin: "20px -17px" }}>{props.title || ""}</h3>
        <Steps direction={listWidth >= innerWidth ? 'vertical' : 'horizontal'} progressDot current={props.current} size={'small'}>
          {
            props.data.map(({ name }) => {
              // @ts-ignore
              return <Step title={name}/>
            })
          }
        </Steps>
      </div>
    )
  }
)
export default Dsteps
