import React, {FC, Fragment, useEffect,  useState} from 'react'

//全屏
// 打开浏览器全屏模式
/**
 * screenChange <Function> 为窗口变化的 的回调函数  参数为当前是否为全屏状态
 */
const init = (screenChange, props)=>{

  // 取值17是为了处理页面内容出现滚动条的情况---现在没有滚动条了
  let isFull = window.screen.height - window.document.documentElement.clientHeight <= 0; // 17
  // 阻止F11键默认事件，用HTML5全屏API代替
  window.addEventListener('keydown', function (e: any) {
    e = e || window.event;
    if (e.keyCode===122 && !isFull) {
      e.preventDefault();
      enterFullScreen();
    }
  });
  //监听窗口变化
  window.addEventListener('resize', function () {
    isFull = window.screen.height - window.document.documentElement.clientHeight <= 0; // 17
    screenChange(isFull);
    props.onFullScreenFn && props.onFullScreenFn()
  })
}

//进入全屏
const enterFullScreen  = () =>{
  let el = document.documentElement as any;
  let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
  if (rfs) { // typeof rfs != "undefined" && rfs
    console.log(el,rfs,"?")
    rfs.call(el)
  } else if (typeof (window as any).ActiveXObject !== 'undefined') {
    // for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
    let wscript = new (window as any).ActiveXObject('WScript.Shell');  //eslint-disable-line
    if (wscript != null) {
      wscript.SendKeys('{F11}')
    }
  }
}


// 退出全屏
const exitFullScreen = ()=>{
  let el = document as any;
  let cfs = el.cancelFullScreen || el.mozCancelFullScreen || el.msExitFullscreen || el.webkitExitFullscreen || el.exitFullscreen;
  if (cfs) { // typeof cfs != "undefined" && cfs
    cfs.call(el);
  } else if (typeof (window as any).ActiveXObject !== 'undefined') {
    // for IE，这里和fullScreen相同，模拟按下F11键退出全屏
    let wscript = new (window as any).ActiveXObject('WScript.Shell'); //eslint-disable-line
    if (wscript != null) {
      wscript.SendKeys('{F11}')
    }
  }
};

const FullScreen = props => {
  const [isScreenFull, setIsScreenFull] = useState(false); //是否全屏

  //屏幕变化
  const screenChange = (isFull)=>{
    setIsScreenFull(isFull);
  };

  const clickHandle = () => {
    if(isScreenFull){
      //退出全屏
      exitFullScreen();
    }else {
      //进入全屏
      enterFullScreen();
    }
  }

  useEffect(()=>{
    //初始化
    init(screenChange, props)
  }, [] );

  return (
    <Fragment>
      <span id='clickHandle' style={{ cursor: 'pointer' }} onClick={clickHandle}>{isScreenFull ? "退出全屏" : "全屏"}</span>
    </Fragment>
  )
}
export default FullScreen
