import React from 'react'
import { message } from 'antd'

interface percentageProps {
    numLeft: number,
    numRight: number,
    textLeft: string,
    textLeftPercen: string,
    textRight: string,
    textRightPercen: string,

}

const Percentage: React.FC<percentageProps> = (props) => {
//     function keepTwoDecimal(num) {
//         let result: any = parseFloat(num)
//         if (isNaN(result)) {
//             message.warning('传递参数错误，请检查！')
//             return
//         }
//         result = (Math.round(num * 100) / 100)
//         return Math.floor(result * 100) + '%'
//         // return result = (Math.round(result*10000))/100 + '%'
//         // return Math.floor(result) + '%'
//    }
//    const resultL = keepTwoDecimal(props.numLeft / (props.numLeft + props.numRight))
//    const resultR = keepTwoDecimal(props.numRight / (props.numLeft + props.numRight))
//    console.log(resultL, resultR, 'lllll')
    return (
        <div className='percentage-wrap'>
            <div className='num-percen row-style'>
                <div className='num-percen-left' style={{width: props.textLeftPercen}}>{props.numLeft || 0}</div>
                <div style={{width: '4px'}}></div>
                <div className='num-percen-right' style={{width: props.textRightPercen}}>{props.numRight || 0}</div>
            </div>
            <div className='text-percen row-style'>
                <div>
                    <span style={{marginRight: '5px'}}>{props.textLeft}</span><span>{props.textLeftPercen || '0%'}</span>
                </div>
                <div>
                    <span style={{marginRight: '5px'}}>{props.textRight}</span><span>{props.textRightPercen || '0%'}</span>
                </div>
            </div>
        </div>
    )
}

export default Percentage