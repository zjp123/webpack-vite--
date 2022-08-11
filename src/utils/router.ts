import { parse, stringify } from 'qs';

let hashHistory
/**
 * 注册路由方法
 * @param  {Object | Array} plugins 待注入的插件
 * @param  {Object} params 注册的属性
 */
export function registerHistoy(history) {
    hashHistory = history;
}

/**
 * 路由跳转方法
 * @param {*}
 */
export const goto = {
    go: (url, options = {}) => {
        hashHistory.go(gotoFormatUrl(url, options));
    },
    push: (url, options = {}) => {
        hashHistory.push(url)
        // hashHistory.push(gotoFormatUrl('/#' + url, options));
    },
    goback: (url, options = {}) => {
        hashHistory.goback(gotoFormatUrl(url, options));
    },
    replace: (url, options = {}) => {
        hashHistory.replace(gotoFormatUrl(url, options));
    }
};

/* 统一格式化跳转路由 */
const gotoFormatUrl = (url, options) => {
    const { queryString, params } = options;
    /* params方式增加路由参数 */
    if (params) {
        url = paramsToUrl(url, params);
    }
    /* queryString方式增加路由参数 */
    if (queryString) {
        url = queryStringToUrl(url, queryString)
    }
    return url;
}

/* params方式增加路由参数 */
const paramsToUrl = (url, params, joinCode = '/') => {
    if (Array.isArray(params)) {
        url = [url, ...params].join(joinCode);
    } else {
        console.error('params must be array in goto arguments');
    }
    return url;
}

/* queryString方式增加路由参数 */
const queryStringToUrl = (url, config, splitCode = '?') => {
    let option = {};
    // tempUrl = url;
    if (url.includes(splitCode)) {
        const urlSplitDatas = url.split(splitCode);
        option = {
            ...option,
            ...parse(urlSplitDatas.pop())
        };
        // tempUrl = urlSplitDatas.join(splitCode);
    }
    option = {
        ...option,
        ...config,
    };

    return `${url}${splitCode}${stringify(option)}`
}
export default {
    goto,
    registerHistoy
}
