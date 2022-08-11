import React, { useEffect, useState } from 'react'
import request from '@/utils/request'
import { Button } from 'antd'

interface ReadCardProps {
    onReaded?: (e: any) => void
    continuity?: boolean
    pushType?: number
    watchState?: (e) => void
}

var callbackfun = function (idcarddata) {
} // 回调函数
var closeFun = function () {
} // 关闭回调函数
function onIDCardSvrInit() {
    var params = {
        // 静态授权码。如果设置为数值则使用动态获取授权，数值为动态获取的授权缓存秒数(0~86400000)，0为长期缓存(版本号为2.19.0.516及以上版本有效)。
        // License: "oFUj/rjN20XYX0Is7vaBDb4Eb+Z8UHj9zCFOCFBTRp5WWGxvnBqVrv5C/kuwzVTpPB5rQCyLUtM24QUaTwBogb28Liwvr25A==",	 //使用静态授权码
        License: '18000', // 使用动态授权码，动态获取的授权码缓存18000秒（5小时）

        // 连续阅读自动停止秒数，设为0则不自动停止
        AutoStopTime: '30',

        // 照片格式，jpg或png，默认jpg。png格式可用PicBgColor来设置透明背景
        PicFormat: 'jpg',

        // 照片背景色，IDCardSvr可以自动替换照片背景色，默认不替换。png格式为：透明度、红、绿、蓝，其它格式为：红、绿、蓝
        // PicBgColor: "FFDDEEFF",
        PicBgColor: '',

        // 优先扫描的端口列表。各端口号使用“,”分隔，用“*”表示缓存端口号
        // Ports: "*, USB1, COM3",	//先扫描缓存端口、USB1端口再扫描COM3端口，未找到再按正常流程扫描。
        Ports: '*,1001,3', // 先扫描缓存端口，未找到再按正常流程扫描。

        // 是否使用串口设备，true或false，如果没有串口设备，建议设为不使用
        ComEnabled: 'true',

        // 数据签名计算表达式加密字串，通过专用编码器生成。此项配合服务端验证，可防阅读数据在中间环节被篡改。有此需求的请联系作者。
        Verify: '+1TohXPW6PtaCt/A1bZBGo4Ei4rL5hR5T81fiUKDS1bIBoHmSVqUPyiwxCb2c92ExA+DHZsobdHbZgsYzuQkJSvf84TicnOQ4gymOa9EC3K0zp1zjcVPG5fI4F/XMix48GvtyZL03vv8T98wr9/IRhBP9w6lSVU3RitAjJXL1RHiAtjkLsEHHo9GoXdwk=',

        // - 设置语音库名（全名或关键字）或序号，可以用,分隔多个语音库，系统使用第一个找到的语音库
        SetVoice: 'VW Liang, Chinese, China, 0',

        // - 设置语速，-10 ~ 10
        SetVoiceRate: '1',

        // -允许(或禁止)本地扩展功能，true或false，如键盘精灵等，不设置此项默认为允许
        LocalFunctionEnable: 'false',

        // -服务器端授权的公司名称，其它授权方式不需要此参数
        LicenseCompany: ''
    }

    // - 阅读参数初始化
    for (var k in params) {
        sendCommand(k + ':' + params[k]) // - 发送参数指令到阅读服务
    }
}

/** ********************************************
 idcardsvr.js    2019-05-28
 2019-05-28    新增ws自动连接多地址扫描 autoConnect("ws://127.0.0.1:13131|ws://127.0.0.1:13132");
 2018-06-09    新增ws自动连接尝试次数（第二参数） autoConnect("ws://127.0.0.1:13131", 3);
 **********************************************/

function idcardsvrQueue() {
    this.dataStore = []
    this.enqueue = idcardsvrQueueEnqueue
    this.dequeue = idcardsvrQueueDequeue
    this.toString = idcardsvrQueueToString
    this.empty = idcardsvrQueueEmpty
    this.clear = idcardsvrQueueClear
    this.count = idcardsvrQueueCount
    this.isSending = false
}

function idcardsvrQueueEnqueue(element) {
    this.dataStore.push(element)
}

function idcardsvrQueueDequeue() {
    return this.dataStore.shift()
}

function idcardsvrQueueToString() {
    var retStr = ''
    for (var i = 0; i < this.dataStore.length; ++i) {
        retStr += this.dataStore[i] + '&nbsp;'
    }
    return retStr
}

function idcardsvrQueueEmpty() {
    return this.dataStore.length === 0
}

function idcardsvrQueueClear() {
    this.dataStore = []
}

function idcardsvrQueueCount() {
    return this.dataStore.length
}

var idcardsvrWs
var idcardsvrSocketCreated = false
var idcardsvrSendQueue = new idcardsvrQueue()
var idcardsvrWsConnectTimeoutId = 0
var idcardsvrWsConnectTimes = 0
var idcardsvrWsConnectLeftTime = 99999999
var IDCARDSVR_DEBUG_LEVEL = 0
var idcardsvrWsUrls = ['ws://127.0.0.1:13131']
var idcardsvrWsUrlIndex = 0

function autoConnect(url = undefined, times = undefined) {
    if (idcardsvrSocketCreated && (idcardsvrWs.readyState === 0 || idcardsvrWs.readyState === 1)) {
        return
    }

    if (typeof url !== 'undefined') {
        idcardsvrWsUrls = url.split('|')
        idcardsvrWsUrlIndex = 0
    } else {
        idcardsvrWsUrlIndex += 1
        idcardsvrWsUrlIndex = idcardsvrWsUrlIndex >= idcardsvrWsUrls.length ? 0 : idcardsvrWsUrlIndex
    }
    var idcardsvrWsUrl = idcardsvrWsUrls[idcardsvrWsUrlIndex]
    if (typeof times !== 'undefined') idcardsvrWsConnectLeftTime = times
    if (idcardsvrWsConnectTimes === 0) idcardsvrWsConnectTimes = idcardsvrWsConnectLeftTime

    onMessage('未建立服务连接，请确保身份证阅读服务已开启。')
    onStatus(101, '自动连接服务中……')

    idcardsvrWsConnectLeftTime -= 1
    try {
        if ('WebSocket' in window) {
            idcardsvrWs = new WebSocket(idcardsvrWsUrl)
        } else if ('MozWebSocket' in window) {
            // @ts-ignore
            idcardsvrWs = new MozWebSocket(idcardsvrWsUrl)
        }
        idcardsvrWs.onopen = idcardsvrWsOnOpen
        idcardsvrWs.onmessage = idcardsvrWsOnMessage
        idcardsvrWs.onclose = idcardsvrWsOnClose
        idcardsvrWs.onerror = idcardsvrWsOnError
        idcardsvrSocketCreated = true
    } catch (ex) {
        onMessage('浏览器不支持WebSocket，无法使用身份证阅读服务。')
    }
}

function idcardsvrWsOnOpen(e) {
    onMessage('连接已经建立。')
    onStatus(103, '等待指令中……')
    idcardsvrWsConnectLeftTime = idcardsvrWsConnectTimes
    idcardsvrLog('连接已经建立。')
    onIDCardSvrInit()
}

function idcardsvrWsOnError(e) {
    // idcardsvrLog("连接出现错误。" + JSON.stringify(e));
}

function idcardsvrWsOnClose(e) {
    clearTimeout(idcardsvrWsConnectTimeoutId)
    // if (idcardsvrWsConnectLeftTime > 0) {
    //     // - 延时后再次连接
    //     idcardsvrWsConnectTimeoutId = setTimeout(function() { autoConnect() }, 2000)
    //     onMessage('未建立服务连接，请确保身份证阅读服务已开启。')
    //     onStatus(101, '自动连接服务中……')
    // } else {
    //     onMessage('未建立服务连接，请确保身份证阅读服务已开启。')
    //     onStatus(102, '已停止自动连接。')
    //     idcardsvrLog('已停止自动连接。', 0)
    // }
}

function idcardsvrWsOnMessage(event) {
    var obj, command
    try {
        obj = JSON.parse(event.data);
        // obj = eval('(' + event.data + ')')
        command = obj.MsgType
    } catch (e) {
        command = 'other'
    }
    try {
        switch (command) {
            case 'GetData':
            case 'IDCardReader':
                onRead(obj)
                idcardsvrLog('Data: ' + event.data, 5)
                break
            case 'OnMessage':
                onMessage(obj.Msg)
                idcardsvrLog('消息: ' + obj.Msg, 3)
                break
            case 'OnStatus':
                onStatus(obj.state, obj.Msg)
                idcardsvrLog('状态: ' + obj.Msg, 4)
                break
            case 'OnLicense':
                onLicense(obj.SAMID, obj.SAMSN)
                idcardsvrLog('授权事件 SAMSN: ' + obj.SAMSN + '，SAMID: ' + obj.SAMID)
                break
            case 'OnResult':
                onResult(obj.Type, obj.Msg)
                idcardsvrLog('Result: ' + obj.Msg, 5)
                break
            default:
                onMessage(event.data)
                idcardsvrLog(event.data)
        }
    } catch (e) {
    }
}

function idcardsvrLog(msg, msgLevel = 1) {
    try {
        if (IDCARDSVR_DEBUG_LEVEL >= msgLevel) {
        }
    } catch (e) {
    }
}

function sendCommand(cmd) {
    if (idcardsvrSocketCreated && idcardsvrWs.readyState === 1) {
        idcardsvrLog('入队指令：' + cmd, 9)
        idcardsvrSendQueue.enqueue(cmd)
        if (!idcardsvrSendQueue.isSending) idcardsvrWsQueueSend()
    } else {
        idcardsvrSendQueue.clear()
        onMessage('连接尚未建立，请稍候执行指令。')
        idcardsvrLog('连接未建立，请建立连接后再执行指令。')
        idcardsvrWsConnectLeftTime = idcardsvrWsConnectTimes
        autoConnect()
    }
}

function idcardsvrWsQueueSend() {
    if (idcardsvrSendQueue.count() > 0) {
        try {
            idcardsvrSendQueue.isSending = true
            var cmd = idcardsvrSendQueue.dequeue()
            // cmd = cmd.trim();
            if (cmd) {
                idcardsvrLog('发送指令：' + cmd, 2)
                idcardsvrWs.send(cmd)
            }
        } catch (e) {
        }
        setTimeout(idcardsvrWsQueueSend, 50)
    } else {
        idcardsvrSendQueue.isSending = false
    }
}

function onMessage(msg) {
}

function onStatus(type, msg) {
    if (type === '0') {
        closeFun()
    }
}

function onRead(idcData) {
    var nation = !idcData.idNation ? '' : '/' + idcData.idNation + '族'
    callbackfun({
        name: idcData.idName,
        sex: parseInt(idcData.idSexCode),
        nationality: '中国' + nation,
        idcard: idcData.idCardNo,
        address: idcData.idAddress,
        headImgUrl: 'data:image/png;base64,' + idcData.idPictureBase64,
        idcardEndTime: idcData.idEndTime.length === 8 ? idcData.idEndTime.substring(0, 4) + '-' + idcData.idEndTime.substring(4, 6) + '-' + idcData.idEndTime.substring(6, 8) : '2099-01-01', // 长期默认2099
        idcardStartTime: idcData.idBeginTime.length === 8 ? idcData.idBeginTime.substring(0, 4) + '-' + idcData.idBeginTime.substring(4, 6) + '-' + idcData.idBeginTime.substring(6, 8) : ''
    })
}

// - 申请授权事件(阅读时如果检测到未正确授权会引发此事件)
function onLicense(SAMID, SAMSN) {
    // - 在此函数内通过自己的方式去获取授权码后，通过 sendCommand("License:" + "你的授权字符串"); 指令进行授权。
    request
        .get('/api/Idcardsvr/authcode/' + SAMSN + '/' + SAMID, null, 'NET_API')
        .then(function (result: any) {
            sendCommand('License:' + result.authCode) // - 获取到授权码后执行授权指令
        })
        .catch(function () {
            onMessage('获取授权码失败')
        })
}

// -其它指令返回结果事件, type为指令类型，msg为执行结果返回消息
function onResult(type, msg) {
    switch (type) {
        case 'about':
            onMessage(msg.replace(/<br>/g, '&nbsp;&nbsp;'))
            break
        case 'samid':
            onMessage('阅读器SAMID：' + msg)
            break
        case 'samsn':
            onMessage('阅读器序列号：' + msg)
            break
        case 'voices':
            onMessage('已安装语音库：' + msg)
            break
        default:
            onMessage(msg)
    }
}

const ReadCard: React.FC<ReadCardProps> = (props) => {
    const { continuity, onReaded, watchState, pushType } = props
    const [isReading, setIsReading] = useState(false)
    const readCard = () => {
        if (continuity) {
            sendCommand('ReadStart')
            setIsReading(true)
        } else {
            sendCommand('ReadOnce')
        }
        watchState && watchState(1)
    }
    const onReadCard = (idx) => {
        onReaded && onReaded(idx)
    }

    const closeRead = () => {
        setIsReading(false)
        watchState && watchState(0)
    }

    //切换为其他查询类型关闭读卡模式
    useEffect(() => {
        if (pushType !== 1) {
            sendCommand('ReadClose')
            watchState && watchState(0)
            setIsReading(false)
        }
    }, [pushType])

    useEffect(() => {
        callbackfun = onReadCard
        closeFun = closeRead
        autoConnect('ws://127.0.0.1:13131')
        return () => {
            sendCommand('ReadClose')
        }
    }, [])
    return (
        <>
            {(continuity && pushType === 1) && (
                <>
                    {!isReading && (
                        <Button onClick={readCard} type="primary"
                            style={{ background: '#32B87F', border: '1px solid #32B87F' }}>
                            读取身份证
                        </Button>
                    )}
                    {isReading && (
                        <Button onClick={() => {
                            sendCommand('ReadClose')
                        }}>
                            关闭读卡模式
                        </Button>
                    )}
                </>
            )}
            {!continuity && (
                <Button onClick={readCard} type="primary"
                    style={{ background: '#32B87F', border: '1px solid #32B87F' }}>
                    读取身份证
                </Button>
            )}
        </>
    )
}

export default ReadCard
