/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
const productName = 'webrtc';
const authorityKey = `${productName}-authority`;


export function setAuthority(authority) {
    // 清除前端权限
    if (authority === null) {
        localStorage.removeItem(authorityKey);
    } else {
        const proAuthority = typeof authority === 'string' ? [authority] : authority;
        localStorage.setItem(authorityKey, JSON.stringify(proAuthority));
    }
}

/**
 * 从localStorage中获取 用户信息，解析返回角色数组
 */
export function getAuthority() {
    const authorityString = localStorage.getItem(authorityKey);
    let authority;
    try {
        authority = JSON.parse(authorityString);
    } catch (e) {
        authority = authorityString;
    }
    if (typeof authority === 'string') {
        return [authority];
    }
    // console.log(authority)
    return authority;
}



