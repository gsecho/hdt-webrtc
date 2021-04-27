/*
 * 这个是 antd 提供的刷新route权限的接口
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from './Authority';

// eslint-disable-next-line import/no-mutable-exports
let Authorized = RenderAuthorized(getAuthority()); 

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
