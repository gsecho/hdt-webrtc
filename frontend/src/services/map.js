import request from '@/utils/request';
import * as helper from '@/utils/helper';
import { stringify } from 'qs';

const backendUrl = url + api;

/**
 * 获取node列表
 * @param {*} params 
 * @param {*} user 
 */
const data = [
    { region: 'europe', coordinate: [50.11208, 8.68341], cn: "法兰克福", city: "Frankfurt", code: "DE", status: 'online' },
    { region: 'europe', coordinate: [45.458626, 9.181873], cn: "米兰", city: "Milan", code: "IT", status: 'online' },
    { region: 'europe', coordinate: [51.507702, -0.12797], cn: "伦敦", city: "London", code: "GB", status: 'online' },
    { region: 'europe', coordinate: [48.856614, 2.352222], cn: "巴黎", city: "Paris", code: "FR", status: 'online' },
    { region: 'europe', coordinate: [55.741638, 37.605061], cn: "莫斯科", city: "Moscow", code: "RU", status: 'online' },
    { region: 'europe', coordinate: [52.373119, 4.89319], cn: "阿姆斯特丹", city: "Amsterdam", code: "NL", status: 'online' },
    { region: 'europe', coordinate: [52.229676, 21.012229], cn: "华沙", city: "Warsaw", code: "PL", status: 'online' },
    { region: 'europe', coordinate: [44.4342, 26.10297], cn: "布加勒斯特", city: "Bucuresti", code: "RO", status: 'online' },
    { region: 'europe', coordinate: [40.421429, -3.67163], cn: "马德里", city: "Madrid", code: "ES", status: 'online' },
    { region: 'europe', coordinate: [59.329324, 18.068581], cn: "斯德哥尔摩", city: "Stockholm", code: "SE", status: 'online' },
    { region: 'europe', coordinate: [50.4501, 30.5234], cn: "基辅", city: "Kyiv", code: "UA", status: 'online' },

    { region: "asia", coordinate: [37.553674, 126.991138], cn: "首尔", city: "Seoul", code: "KR", status: 'online' },
    { region: "asia", coordinate: [35.709026, 139.731993], cn: "东京", city: "Tokyo", code: "JP", status: 'online' },
    { region: "asia", coordinate: [34.693738, 135.502165], cn: "大阪", city: "Osaka", code: "JP", status: 'online' },
    { region: "asia", coordinate: [12.97754, 77.59951], cn: "班加罗尔", city: "Bengaluru", code: "IN", status: 'online' },
    { region: "asia", coordinate: [19.090281, 72.871368], cn: "孟买", city: "Mumbai", code: "IN", status: 'online' },
    { region: "asia", coordinate: [28.660172, 77.229817], cn: "德里", city: "Delhi", code: "IN", status: 'online' },
    { region: "asia", coordinate: [13.05939, 80.245667], cn: "钦奈", city: "Chennai", code: "IN", status: 'online' },
    { region: "asia", coordinate: [22.396428, 114.109497], cn: "香港", city: "Hongkong", code: "CN", status: 'online' },
    { region: "asia", coordinate: [1.352083, 103.819836], cn: "新加坡", city: "Singapore", code: "SG", status: 'online' },
    { region: "asia", coordinate: [-6.208428, 106.844563], cn: "雅加达", city: "Jakarta", code: "ID", status: 'online' },
    { region: "asia", coordinate: [3.94515, 114.401657], cn: "吉隆坡", city: "Kuala Lumpur", code: "MY", status: 'online' },
    { region: "asia", coordinate: [15.59305, 120.739067], cn: "马尼拉", city: "Manila", code: "PH", status: 'online' },
    { region: "asia", coordinate: [24.26119, 45.120331], cn: "吉达", city: "Jeddah", code: "SA", status: 'online' },
    { region: "asia", coordinate: [15.391327, 100.974161], cn: "曼谷", city: "Bangkok", code: "TH", status: 'online' },
    { region: "asia", coordinate: [39.942928, 32.860481], cn: "安卡拉", city: "Ankara", code: "TR", status: 'online' },
    { region: "asia", coordinate: [41.083498, 28.981156], cn: "伊斯坦布尔", city: "Istanbul", code: "TR", status: 'online' },
    { region: "asia", coordinate: [25.016983, 121.462787], cn: "台北", city: "Taipei", code: "CN", status: 'online' },
    { region: "asia", coordinate: [24.01438, 53.976898], cn: "富查伊拉", city: "Fujayrah", code: "AE", status: 'online' },
    { region: "asia", coordinate: [10.768451, 106.694363], cn: "胡志明市", city: "Ho Chi Minh", code: "VN", status: 'online' },
    { region: "asia", coordinate: [21.022697, 105.836964], cn: "河内", city: "Hanoi", code: "VN", status: 'online' },
    { region: "asia", coordinate: [10.376991, 123.822512], cn: "宿务", city: "Cebu", code: "PHL", status: 'online' },


    { region: "mainlandChina", coordinate: [31.86141, 117.27562], cn: "合肥", city: "Hefei", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [39.938884, 116.397459], cn: "北京", city: "Beijing", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [23.12911, 113.264385], cn: "江门", city: "Jiangmen", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [23.53511, 116.350021], cn: "揭阳", city: "Jieyang", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [23.3552, 116.675522], cn: "汕头", city: "Shantou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [45.755199, 126.62252], cn: "哈尔滨", city: "Haerbin", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [45.755199, 126.62252], cn: "绥化", city: "Suihua", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [32.9804, 114.016808], cn: "驻马店", city: "Zhumadian", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [32.385502, 119.42701], cn: "扬州", city: "Yangzhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [30.658529, 104.075546], cn: "成都", city: "Chengdu", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [36.087509, 120.34272], cn: "青岛", city: "Qingdao", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [36.799999, 118.050003], cn: "淄博", city: "Zibo", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [31.224349, 121.476753], cn: "上海", city: "Shanghai", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [39.125032, 117.295532], cn: "天津", city: "Tianjin", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [30.252501, 120.165024], cn: "宁波", city: "Ningbo", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [30.0194, 122.102798], cn: "舟山", city: "Zhoushan", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [30.762653, 120.750865], cn: "嘉兴", city: "Jiaxing", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [32.454088, 119.93006], cn: "泰州", city: "Taizhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [34.261792, 117.184811], cn: "徐州", city: "Xuzhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [23.079404, 114.412599], cn: "惠州", city: "Huizhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [34.759197, 113.778584], cn: "郑州", city: "Zhengzhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [34.281082, 108.797862], cn: "西咸", city: "Xixian", code: "CN", status: 'online' },



    { region: "northAmerica", coordinate: [32.78183, -96.79586], cn: "达拉斯", city: "Dallas", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [39.36954, -77.79649], cn: "阿什本", city: "Ashburn", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [34.052234, -118.243685], cn: "洛杉矶", city: "Los Angeles", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [25.76168, -80.19179], cn: "迈阿密", city: "Miami", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [40.712784, -74.005941], cn: "纽约", city: "New York", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [41.878114, -87.629798], cn: "芝加哥", city: "Chicago", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [37.3386, -121.886002], cn: "圣荷西", city: "San Jose", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [33.748995, -84.387982], cn: "亚特兰大", city: "Atlanta", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [47.706381, -122.668509], cn: "西雅图", city: "Seattle", code: "US", status: 'online' },
    { region: "northAmerica", coordinate: [43.64856, -79.385368], cn: "多伦多", city: "Toronto", code: "CA", status: 'online' },
    { region: "northAmerica", coordinate: [45.387423, -73.181421], cn: "蒙特利尔", city: "Montreal", code: "CA", status: 'online' },

    { region: "southAmerica", coordinate: [-23.55052, -46.633309], cn: "圣保罗", city: "Sao Paulo", code: "BR", status: 'online' },
    { region: "southAmerica", coordinate: [-22.97673, -43.19508], cn: "里约热内卢", city: "Rio De Janeiro", code: "BR", status: 'online' },
    { region: "southAmerica", coordinate: [-35.705219, -71.341087], cn: "圣地亚哥", city: "Santiago", code: "CL", status: 'online' },

    { region: "oceania", coordinate: [-37.813627, 144.963057], cn: "墨尔本", city: "Melbourne", code: "AU", status: 'online' },
    { region: "oceania", coordinate: [-37.591891, 175.537479], cn: "怀卡托区", city: "Waikato", code: "NZ", status: 'online' },

    { region: "oceania", coordinate: [-33.888253, 18.553321], cn: "开普敦", city: "Cape Town", code: "ZAF", status: 'online' }
];

const dropData = [
    { region: 'europe', coordinate: [53.349805, -6.26031], cn: "都柏林", city: "Dublin", code: "IE", status: 'online' },
    { region: "mainlandChina", coordinate: [21.67061, 110.891319], cn: "茂名", city: "Maoming", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [31.766211, 119.94722], cn: "常州", city: "Changzhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [41.86792, 123.894363], cn: "抚顺", city: "Fushun", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [40.842585, 111.749181], cn: "呼和浩特", city: "Huhehaote", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [30.863501, 120.096222], cn: "湖州", city: "Huzhou", code: "CN", status: 'online' },
    { region: "mainlandChina", coordinate: [29.10721, 119.64901], cn: "金华", city: "Jinhua", code: "CN", status: 'online' },
    { region: "northAmerica", coordinate: [39.740002, -104.991997], cn: "丹佛", city: "Denver", code: "US", status: 'online' },

];

export async function listNode(params, user) {
    let result = [...data];
    const { searchString, region } = params;
    if (searchString || region) {
        result = result.reduce((total, item) => {
            let fit = true;
            if (searchString && item.city.toLowerCase().indexOf(searchString.toLowerCase()) === -1) {
                fit = false;
            }
            if (region && item.region != region) {
                fit = false;
            }
            fit && total.push(item);
            return total;
        }, []);
    }
    return { totalCount: result.length, data: result };
}

export async function listAllNode(user) {
    const result = { data };
    return result;
}