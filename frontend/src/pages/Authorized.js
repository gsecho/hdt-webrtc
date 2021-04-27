/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/Authority';
import Redirect from 'umi/redirect';
import * as myRedirect from '@/utils/redirect'
import * as tokenUtils from '@/utils/tokenUtils'



export default ({ children }) => {
  let Authority;
  let redirectUrl;
  if(tokenUtils.tokenValidate()){
    Authority = getAuthority();
    redirectUrl = '/';// 这里是权限不足的重定向，可以根据需求修改
  }else{
    //  token非法、重定向到登录页
    Authority = [];
    redirectUrl = myRedirect.getRedirectLoginUrl()
    tokenUtils.removeTokenAuthority()
  }
  const Authorized = RenderAuthorized(Authority);
  const result = <Authorized authority={children.props.route.authority} noMatch={<Redirect to={redirectUrl} />}>
    {children}
  </Authorized>
  // console.log(result); 
  return result;
};
