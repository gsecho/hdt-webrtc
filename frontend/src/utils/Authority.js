/*
 * 提供权限相关的接口
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import lodash from 'lodash'

const AUTHORITY_KEY = 'authority';

function getAuthorityItem(){
    return localStorage.getItem(AUTHORITY_KEY);
}

function setAuthorityItem(value){
    localStorage.setItem(AUTHORITY_KEY, value);
}

function removeAuthorityItem(){
    localStorage.removeItem(AUTHORITY_KEY);
}

export function setAuthority(authority) {
    if((!lodash.isUndefined(authority)) && (authority instanceof Array )){
        setAuthorityItem(JSON.stringify(authority));
    }else{
        // 清除前端权限
        removeAuthorityItem()
    }
}

/**
 * 从localStorage中获取 用户信息，解析返回角色数组
 */
export function getAuthority() {
    const authorityString = getAuthorityItem()
    let authority;
    try {
        authority = JSON.parse(authorityString);
    } catch (e) {
        // nothing
        // authority = [];
    }
    if(!(authority instanceof Array)){
        authority = [];
    }
    // console.log(authority)
    return authority;
}






