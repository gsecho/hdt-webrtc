/*
 * @Author: chenrf
 * @Date: 2021-06-02 13:52
 */

 // 针对quantil 域名，更改模板
 export default function faviconUpdate() {
    let iconUrl = '';

    const {hostname} = window.location;
    if (hostname.indexOf('.quantil.com') !== -1) {
      iconUrl = '/quantilFavicon.png';
    }else {
    // else if (hostname.indexOf('.cdnetworks.com') !== -1) {
      iconUrl = '/cdnwFavicon.png';
    }
    
    // 设置favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = iconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
}

