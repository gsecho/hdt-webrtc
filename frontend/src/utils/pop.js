import { Modal, notification } from 'antd';
import * as wrapper from './wrapper';

const {confirm} = Modal;

// 弹出info
export function showInfo(desc='', duration=4.5, title='Information', key=''){
  if(key === ''|| key === null){
    key = (new Date()).getTime();
  }
  if(duration === '' || duration === null){
    duration = 4.5;
  }
  notification.info({
    message: title,
    description: desc,
    duration,
    key,
    className: 'custom-notification',
  });
}

// 弹出warning
export function showWarning(desc='', duration=4.5, title='Warning', key=''){
  if(key === ''|| key === null){
    key = (new Date()).getTime();
  }
  if(duration === '' || duration === null){
    duration = 4.5;
  }
  notification.warning({
    message: title,
    description: desc,
    duration,
    key,
    className: 'custom-notification',
  });
}

// 弹出error
export function showError(desc='', duration=4.5, title='Error', key=''){
  if(key === ''|| key === null){
    key = (new Date()).getTime();
  }
  if(duration === '' || duration === null){
    duration = 4.5;
  }
  notification.error({
    message: title,
    description: desc,
    duration,
    key,
    className: 'custom-notification',
  });
}

// 弹出success
export function showSuccess(desc='', duration=4.5, title='Success', key=''){
  if(key === ''|| key === null){
    key = (new Date()).getTime();
  }
  if(duration === '' || duration === null){
    duration = 4.5;
  }
  notification.success({
    message: title,
    description: desc,
    duration,
    key,
    className: 'custom-notification',
  });
}

// error modal
export function showErrorModal(desc='', title='Error', width=416){
  Modal.error({
    title,
    content: (desc),
    okType: 'default',
    mask: false,
    width,
  });
}

// 显示api error
export function showApiError(errCode='', errMsg=''){
  let text = '';
  let cssName = '';
  // css 默认样式
  let width = 416;

  if(errCode && errCode.toLowerCase() === 'invalidspecification' || errCode.toLowerCase() === 'invalidresourcekind'){
    text = wrapper.wrapTextForHttpError(errCode, errMsg);
    cssName = 'custom-err-modal-content-view';
    width = 600;
  }else{
    text = errMsg;
  }

  const content = (
    <div className={cssName}>
      <div>Error Code: {errCode}</div>
      <div>{text}</div>
    </div>
  );
  const title = 'Error Occurred!';
  showErrorModal(content, title, width);
}

// warning modal
export function showWarningModal(desc='', title='Warning'){
  Modal.warning({
    title,
    content: (desc),
    okType: 'default',
  });
}

// info modal
export function showInfoModal(desc='', title='Info'){
  Modal.info({
    title,
    content: (desc),
  });
}

// success modal
export function showSuccessModal(desc='', title='Success'){
  Modal.success({
    title,
    content: (desc),
  });
}

export function showConfirm(desc='', title='', restProps={}){
  let arr = [desc];
  if(desc.indexOf("\r\n") !== -1){
    arr = desc.split("\r\n");
  }

  confirm({
      title,
      content: <div>{arr.map((item, index) => <div>{item}</div>)}
               </div>,
      ...restProps,
  });
}
