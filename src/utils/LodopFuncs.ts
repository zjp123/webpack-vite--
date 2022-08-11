let CreatedOKLodop7766 = null

//====判断是否需要安装CLodop云打印服务器:====
export function needCLodop() {
    try {
        let ua = navigator.userAgent
        if (ua.match(/Windows\sPhone/i) != null) {
            return true
        }
        if (ua.match(/iPhone|iPod/i) != null) {
            return true
        }
        if (ua.match(/Android/i) != null) {
            return true
        }
        if (ua.match(/Edge\D?\d+/i) != null) {
            return true
        }

        let verTrident = ua.match(/Trident\D?\d+/i)
        let verIE = ua.match(/MSIE\D?\d+/i)
        let verOPR = ua.match(/OPR\D?\d+/i)
        let verFF = ua.match(/Firefox\D?\d+/i)
        let x64 = ua.match(/x64/i)
        if (verTrident == null && verIE == null && x64 !== null) {
            return true
        } else if (verFF !== null) {
            verFF = verFF[0].match(/\d+/)
            if (Number(verFF[0]) >= 42 || x64 !== null) {
                return true
            }
        } else if (verOPR !== null) {
            verOPR = verOPR[0].match(/\d+/)
            if (Number(verOPR[0]) >= 32) {
                return true
            }
        } else if (verTrident == null && verIE == null) {
            let verChrome = ua.match(/Chrome\D?\d+/i)
            if (verChrome !== null) {
                verChrome = verChrome[0].match(/\d+/)
                if (Number(verChrome[0]) >= 42) {
                    return true
                }
            }
        }
        return false
    } catch (err) {
        return true
    }
}

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
    let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
    let oscript = document.createElement('script')
    // oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=1'
    head.insertBefore(oscript, head.firstChild)

    //引用双端口(8000和18000）避免其中某个被占用：
    oscript = document.createElement('script')
    // oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=0'
    head.insertBefore(oscript, head.firstChild)

    oscript = document.createElement('script')
    // oscript.src = 'https://localhost:8443/CLodopfuncs.js?priority=2'
    head.insertBefore(oscript, head.firstChild)
}

//====获取LODOP对象的主过程：====
export function getLodop(oOBJECT, oEMBED) {
    let strHtmInstall = '打印控件未安装!请点击右上角头像，在插件下载中下载打印插件进行安装，安装后请刷新页面或重新进入。'
    let strHtmUpdate = '打印控件需要升级!请点击右上角头像，在插件下载中下载打印插件进行安装，升级后请重新进入。'
    let strHtm64_Install = '打印控件未安装!请点击右上角头像，在插件下载中下载打印插件进行安装，安装后请刷新页面或重新进入。'
    let strHtm64_Update = '打印控件需要升级!请点击右上角头像，在插件下载中下载打印插件进行安装，升级后请重新进入。'
    // let strHtmFireFox = '（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）'
    // let strHtmChrome = '(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）'
    let strCLodopInstall = 'CLodop云打印服务(localhost本地)未安装启动!请点击右上角头像，在插件下载中下载打印插件进行安装，安装后请刷新页面。'
    let strCLodopUpdate = 'CLodop云打印服务需升级!请点击右上角头像，在插件下载中下载打印插件进行安装，升级后请刷新页面。'
    let LODOP: any
    // let CLODOP: any
    try {
        let isIE = navigator.userAgent.indexOf('MSIE') >= 0 || navigator.userAgent.indexOf('Trident') >= 0
        let is64IE = isIE && navigator.userAgent.indexOf('x64') >= 0
        if (is64IE || is64IE) {
            return getLodopNew(oOBJECT, oEMBED)
        }

        if (needCLodop()) {
            try {// @ts-ignore
                LODOP = getCLodop()
            } catch (err) { }

            if (!LODOP && document.readyState !== 'complete') {
                alert('C-Lodop没准备好，请稍后再试！')
                return
            }

            if (!LODOP) {
                if (isIE) {
                    document.write(strCLodopInstall)
                } else {
                    alert(strCLodopInstall)
                }
                return
            }

            if (LODOP.CVERSION < '2.0.9.3') {
                if (isIE) {
                    document.write(strCLodopUpdate)
                } else {
                    alert(strCLodopInstall)
                }
                //document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML;
            }

            if (oEMBED && oEMBED.parentNode) {
                oEMBED.parentNode.removeChild(oEMBED)
            }
            if (oOBJECT && oOBJECT.parentNode) {
                oOBJECT.parentNode.removeChild(oOBJECT)
            }
        } else {
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT !== undefined || oEMBED !== undefined) {
                if (isIE) {
                    LODOP = oOBJECT
                } else {
                    LODOP = oEMBED
                }
            } else if (CreatedOKLodop7766 == null) {
                LODOP = document.createElement('object')
                LODOP.setAttribute('width', 0)
                LODOP.setAttribute('height', 0)
                LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;')
                if (isIE) {
                    LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA')
                } else {
                    LODOP.setAttribute('type', 'application/x-print-lodop')
                }
                document.documentElement.appendChild(LODOP)
                CreatedOKLodop7766 = LODOP
            } else {
                LODOP = CreatedOKLodop7766
            }
            //=====Lodop插件未安装时提示下载地址:==========
            if (LODOP == null || typeof LODOP.VERSION === 'undefined') {
                if (navigator.userAgent.indexOf('Chrome') >= 0) {
                    alert(strCLodopInstall)
                }
                //document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
                if (navigator.userAgent.indexOf('Firefox') >= 0) {
                    alert(strCLodopInstall)
                }
                // document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
                if (is64IE) {
                    document.write(strHtm64_Install)
                } else if (isIE) {
                    document.write(strHtmInstall)
                } else {
                    alert(strCLodopInstall)
                }
                //document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
                return LODOP
            }
        }

        if (LODOP.VERSION < '6.2.1.6') {
            if (needCLodop()) {
                alert(strCLodopInstall)
            } //document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML;
            else if (is64IE) {
                document.write(strHtm64_Update)
            } else if (isIE) {
                document.write(strHtmUpdate)
            } else {
                alert(strCLodopInstall)
            }
            //document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
            return LODOP
        }

        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
        LODOP.SET_LICENSES('', 'C265D2E99AF063B45773707E9B73962527C', '', '')
        //===========================================================
        return LODOP
    } catch (err) {
        alert('getLodop出错:' + err)
    }
}

//====获取LODOP对象的主过程：====
function getLodopNew(oOBJECT, oEMBED) {
    // var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    // var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    // var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    // var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    // var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    // var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    // var strCLodopInstall_1 = "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>下载执行安装</a>";
    // var strCLodopInstall_2 = "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）";
    // var strCLodopInstall_3 = "，成功后请刷新本页面。</font>";
    // var strCLodopUpdate = "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";

    let strHtmInstall = '打印控件未安装!请点击右上角头像，在插件下载中下载打印插件进行安装，安装后请刷新页面或重新进入。'
    let strHtmUpdate = '打印控件需要升级!请点击右上角头像，在插件下载中下载打印插件进行安装，升级后请重新进入。'
    let strHtm64_Install = '打印控件未安装!请点击右上角头像，在插件下载中下载打印插件进行安装，安装后请刷新页面或重新进入。'
    let strHtm64_Update = '打印控件需要升级!请点击右上角头像，在插件下载中下载打印插件进行安装，升级后请重新进入。'
    let strHtmFireFox = '（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）'
    let strHtmChrome = '(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）'
    let strCLodopInstall = 'CLodop云打印服务(localhost本地)未安装启动!请点击右上角头像，在插件下载中下载打印插件进行安装，安装后请刷新页面。'
    let strCLodopUpdate = 'CLodop云打印服务需升级!请点击右上角头像，在插件下载中下载打印插件进行安装，升级后请刷新页面。'

    let LODOP
    try {
        let ua = navigator.userAgent
        let isIE = Boolean(ua.match(/MSIE/i)) || Boolean(ua.match(/Trident/i))
        if (needCLodop()) {
            try {
                // @ts-ignore
                LODOP = getCLodop()
            } catch (err) { }
            if (!LODOP && document.readyState !== 'complete') {
                alert('网页还没下载完毕，请稍等一下再操作.')
                return
            }
            if (!LODOP) {
                alert(strCLodopInstall)
                return
            }
            // @ts-ignore
            if (LODOP.CVERSION < '3.0.9.2') {
                alert(strCLodopUpdate)
            }
            if (oEMBED && oEMBED.parentNode) {
                oEMBED.parentNode.removeChild(oEMBED)
            }
            if (oOBJECT && oOBJECT.parentNode) {
                oOBJECT.parentNode.removeChild(oOBJECT)
            }
        } else {
            var is64IE = isIE && Boolean(ua.match(/x64/i))
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT || oEMBED) {
                if (isIE) {
                    LODOP = oOBJECT
                } else {
                    LODOP = oEMBED
                }
            } else if (!CreatedOKLodop7766) {
                LODOP = document.createElement('object')
                LODOP.setAttribute('width', 0)
                LODOP.setAttribute('height', 0)
                LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;')
                if (isIE) {
                    LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA')
                } else {
                    LODOP.setAttribute('type', 'application/x-print-lodop')
                }
                document.documentElement.appendChild(LODOP)
                CreatedOKLodop7766 = LODOP
            } else {
                LODOP = CreatedOKLodop7766
            }
            //=====Lodop插件未安装时提示下载地址:==========
            if (!LODOP || !LODOP.VERSION) {
                if (ua.indexOf('Chrome') >= 0) {
                    alert(strHtmChrome)
                } else if (ua.indexOf('Firefox') >= 0) {
                    alert(strHtmFireFox)
                } else if (is64IE) {
                    alert(strHtm64_Install)
                } else if (isIE) {
                    alert(strHtmInstall)
                } else {
                    alert(strHtmInstall)
                }

                return LODOP
            }
        }
        if (LODOP.VERSION < '6.2.2.6') {
            if (!needCLodop()) {
                if (is64IE) {
                    alert(strHtm64_Update)
                } else if (isIE) {
                    alert(strHtmUpdate)
                } else {
                    alert(strHtmUpdate)
                }
            }
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==
        LODOP.SET_LICENSES('', 'C265D2E99AF063B45773707E9B73962527C', '', '')
        //=======================================================
        return LODOP
    } catch (err) {
        alert('getLodop出错:' + err)
    }
}
