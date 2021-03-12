import global from '../config/backend';
const dataRoot = global.dev.dataRoot;

const trafficData = `{
  { "status": 1 ,
    "content": {
      "records-count": 2,
      "upload–summary": 2508724,
      "download-summary": 2508724,
      "flow-data": [
        {
          "timestamp": "2014-07-31T23:05:00",
          "upload": 197421,
          "download": 297421
        },
        {
          "timestamp": "2014-07-31T23:10:00",
          "upload": 255564,
          "download": 155564
        }
      ]
    }
  }
}`;

function getTrafficData(req, res) {
  const count = 288;
  let result = {};
  result["records-count"] = count;
  result["upload-summary"] = 2508724;
  result["download-summary"] = 2508724;

  let flowData = [];
  let now = (new Date()).getTime();
  for (let i = 0; i < count; i++) {
    let obj = {
      timestamp: now - i * 300 * 1000,
      upload: parseInt(60 + Math.random() * 5),
      download: parseInt(100 + Math.random() * 5)
    };
    flowData.push(obj);
  }
  result["flow-data"] = flowData;
  return res.json({
    [dataRoot]: result,
    ['status']: 1,
  });
  // const result = `{ "status": 1 ,"${dataRoot}":{"records-count":22,"upload-summary":3665814807,"flow-data":[{"download":74530280199,"upload":383432759,"timestamp":"2020-09-01T00:00:00"},{"download":96715965710,"upload":467570176,"timestamp":"2020-09-02T00:00:00"},{"download":109828456578,"upload":618670530,"timestamp":"2020-09-03T00:00:00"},{"download":85703462567,"upload":361076272,"timestamp":"2020-09-04T00:00:00"},{"download":49274236377,"upload":229930554,"timestamp":"2020-09-05T00:00:00"},{"download":34373672276,"upload":162759762,"timestamp":"2020-09-06T00:00:00"},{"download":67692773724,"upload":313985235,"timestamp":"2020-09-07T00:00:00"},{"download":79587631478,"upload":316539841,"timestamp":"2020-09-08T00:00:00"},{"download":9375888033,"upload":90046003,"timestamp":"2020-09-09T00:00:00"},{"download":41035614766,"upload":179162705,"timestamp":"2020-09-10T00:00:00"},{"download":504072609,"upload":49215586,"timestamp":"2020-09-11T00:00:00"},{"download":20665690,"upload":19039226,"timestamp":"2020-09-12T00:00:00"},{"download":10539076,"upload":38124841,"timestamp":"2020-09-13T00:00:00"},{"download":27364394,"upload":69422483,"timestamp":"2020-09-14T00:00:00"},{"download":58641991,"upload":71651972,"timestamp":"2020-09-15T00:00:00"},{"download":43832757,"upload":68833273,"timestamp":"2020-09-16T00:00:00"},{"download":53751789,"upload":84655807,"timestamp":"2020-09-17T00:00:00"},{"download":63290371,"upload":30476789,"timestamp":"2020-09-18T00:00:00"},{"download":16739046,"upload":33879028,"timestamp":"2020-09-19T00:00:00"},{"download":22452781,"upload":42006146,"timestamp":"2020-09-20T00:00:00"},{"download":16166805,"upload":35333870,"timestamp":"2020-09-21T00:00:00"},{"download":1014,"upload":1949,"timestamp":"2020-09-22T00:00:00"}],"downloadSummary":648955500031}}`;
  // return res.json(JSON.parse(result));
}

const requestData = `{
  { "status": 1
    "content": {
      "records-count": 6,
      "total-summary": 1000,
      "success-summary": 900,
      "requests-data": [
        {
          "timestamp": "2014-07-31T23:05:00",
          "total": 200,
          "success": 200
        },
        {
          "timestamp": "2014-07-31T23:10:00",
          "total": 200,
          "success": 200
        }
      ]
    }
  }
}`

function getRequests(req, res) {
  const count = 288;
  let result = {};
  result["records-count"] = count;
  result["total-summary"] = 2508724;
  result["success-summary"] = 2508724;

  let requestData = [];
  let now = (new Date()).getTime();
  for (let i = 0; i < count; i++) {
    const total = parseInt(20 + Math.random() * 2);
    let obj = {
      timestamp: now - i * 300 * 1000,
      total: total,
      success: parseInt(total - Math.random() * 2)
    };
    requestData.push(obj);
  }
  result["requests-data"] = requestData;
  return res.json({
    ['status']: 1,
    [dataRoot]: result
  });
}


function getAccess(req, res) {
  // let num = Math.ceil(Math.random() * 5);
  // const access = [
  //     "www.topspeed.com",
  //     `www.topquick${++num}.com`,
  //     `www.uniform${++num}.com`,
  //     `www.max${++num}.com`,
  //     `www.hugeslow${++num}.com`,
  //     `www.interact${++num}.com`,
  //     `www.topquick${++num}.com`,
  //     `www.uniform${++num}.com`,
  //     `www.max${++num}.com`,
  //     `www.hugeslow${++num}.com`,
  //     `www.interact${++num}.com`,
  //     `www.topquick${++num}.com`,
  //     `www.uniform${++num}.com`,
  //     `www.max${++num}.com`,
  //     `www.hugeslow${++num}.com`,
  //     `www.interact${++num}.com`,
  //     `www.topquick${++num}.com`,
  //     `www.uniform${++num}.com`,
  //     `www.max${++num}.com`,
  //     `www.hugeslow${++num}.com`,
  //     `www.interact${++num}.com`,
  //     `www.topquick${++num}.com`,
  //     `www.uniform${++num}.com`,
  //     `www.max${++num}.com`,
  //     `www.hugeslow${++num}.com`,
  //     `www.interact${++num}.com`,
  //     `www.topquick${++num}.com`,
  //     `www.uniform${++num}.com`,
  //     `www.max${++num}.com`,
  //     `www.hugeslow${++num}.com`,
  //     `www.interact${++num}.com`,
  // ];
  // return res.json({
  //   [dataRoot]: access
  // });
  const access = { "code": "0", "content": ["baidu.com", "bigfile.test.hdt.qtlcname.com", "gcr.io", "global.test.hdt.qtlcname.com", "global.test2.hdt.qtlcname.com", "hdt.qtlcname.com", "hdtdemo.baidu.com", "hdtdemo.ted.com", "shanghai.test.hdt.qtlcname.com", "sjc.test.hdt.qtlcname.com", "socks5.hdt.qtlcname.com", "swcdn.apple.com", "t4588.qtlcname.com", "tesingregion.qtlcname.com", "web1.hubengage.com", "p29430.cedexis-test.com", "cdnetworks-dsaap.cedexis-test.com", "p29431.cedexis-test.com", "cdnetworks-dsaeu.cedexis-test.com", "p29432.cedexis-test.com", "cdnetworks-dsaus.cedexis-test.com"], "message": "Success", "status": 1 }
  return res.json(access);
}

function getTransports(req, res) {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({ transportName: "www.topspeed.com:" + i, transportId: i,status:i%2 })
  }
  return res.json({
    [dataRoot]: data
  });
}


const backendUrl = global.dev.url + global.dev.api;
export default {
  [`GET ${backendUrl}/report/flow`]: getTrafficData,
  [`GET ${backendUrl}/report/requests`]: getRequests,
  [`GET ${backendUrl}/report/access-domain`]: getAccess,
  [`GET ${backendUrl}/report/transport`]: getTransports,
}