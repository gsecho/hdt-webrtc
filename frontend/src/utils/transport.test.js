import {
  checkAccessDomain, transTransportData, setPortReuse, setUseUdp,
  isPortReuseChange, getIsPortReuse, dbToFormData
} from './transport';

function testCheckAccessDomain() {
  test('checkAccessDomain tests', () => {
    // 出错的
    expect(checkAccessDomain("a;")).toEqual("Please use comma to separate domains.");
    expect(checkAccessDomain("www.testtesttesttesttesttesttesttesttesttest.testtesttesttesttesttesttesttesttesttest.testtesttesttesttesttesttesttesttesttest.testtesttesttesttesttesttesttesttesttest.testtesttesttesttesttesttesttesttesttest.testtesttesttesttesttesttesttesttesttest.testtesttesttesttesttesttesttesttesttest.com:8080"))
      .toEqual("Please limit domain to no more than 256 characters.");
    expect(checkAccessDomain("www.")).toEqual("The access domain is invalid.");
    expect(checkAccessDomain("www.abc.com.")).toEqual("The access domain is invalid.");
    expect(checkAccessDomain("www")).toEqual("The access domain is invalid.");
    expect(checkAccessDomain("www.*.com")).toEqual("The access domain is invalid.");
    expect(checkAccessDomain("www.-abc.com")).toEqual("The access domain is invalid.");
    expect(checkAccessDomain("www.test.com,www.-abc.com,www.test.cn")).toEqual("The access domain is invalid.");

    // 正确的
    expect(checkAccessDomain("")).toEqual("");
    expect(checkAccessDomain("www.test.com:8080")).toEqual("");
    expect(checkAccessDomain("*.sprint5.com")).toEqual("");
    expect(checkAccessDomain("*.testsp5.com,abc*.test.com")).toEqual("");
    expect(checkAccessDomain("*a.sprint5.com,a*.test.com")).toEqual("");
    expect(checkAccessDomain("*.accessdomainEh.com")).toEqual("");
    expect(checkAccessDomain("*.accessdomainDC.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess4.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess5.com")).toEqual("");
    expect(checkAccessDomain("domain1.com,ds.com,kk.com,*.mw.com")).toEqual("");
    expect(checkAccessDomain("*.mw.com")).toEqual("");
    expect(checkAccessDomain("*.fdf.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess5.com,www.wlinaccess55.com")).toEqual("");
    expect(checkAccessDomain("www.wlinaccess8.com,*.wlinaccess8.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess12.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess12.com,*.wlinaccess121.com")).toEqual("");
    expect(checkAccessDomain("*.access.com")).toEqual("");
    expect(checkAccessDomain("*a.wlinaccess20.com")).toEqual("");
    expect(checkAccessDomain("a*.wlinaccess20.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess20.com")).toEqual("");
    expect(checkAccessDomain("a*.wlinaccess21.com")).toEqual("");
    expect(checkAccessDomain("*a.wlinaccess21.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess21.com")).toEqual("");
    expect(checkAccessDomain("new*.domain.com")).toEqual("");
    expect(checkAccessDomain("*new.dsdw.com")).toEqual("");
    expect(checkAccessDomain("*.com")).toEqual("");
    expect(checkAccessDomain("*443.com")).toEqual("");
    expect(checkAccessDomain("*.er3-erwe23.de.com")).toEqual("");
    expect(checkAccessDomain("aaa.domain1.com,*.domain2.com,sub*.domain3.com,*sub.domain4.com")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499938464846.int")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499938489244.com")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499938513147.it")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499942731021.com")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499942757101.int")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499942782402.tv")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499949948398.one")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499949980262.in")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499950004064.one")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499952511247.int")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499952535011.tel")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499952565403.onl")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499952640311.me")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499952667857.biz")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499952693448.int")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j802.t1500634634155.uk")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j802.t1500634660999.net")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j802.t1500634685908.pro")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j802.t1500634754956.gov")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j802.t1500634781358.eu")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j802.t1500634805236.tel")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess22.com")).toEqual("");
    expect(checkAccessDomain("test-1.access.com,*.subDomain.com")).toEqual("");
    expect(checkAccessDomain("*.access.com,test-1.access.com")).toEqual("");
    expect(checkAccessDomain("mydomain2.com,*.mydomains.com")).toEqual("");
    expect(checkAccessDomain("mydomain3.com,*.mydomains.com")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j806.t1501163036136.onl")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j806.t1501163113529.onl")).toEqual("");
    expect(checkAccessDomain("*.access.com,testRobot-20.access.com")).toEqual("");
    expect(checkAccessDomain("*.mwtrial.info")).toEqual("");
    expect(checkAccessDomain("*.sub.com")).toEqual("");
    expect(checkAccessDomain("*.baidu.com:80")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j1231.t1534421697239.int")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j1311.t1534421829014.tv")).toEqual("");
    expect(checkAccessDomain("*.test1018.com")).toEqual("");
    expect(checkAccessDomain("*.test1026.com")).toEqual("");
    expect(checkAccessDomain("*.quantil.com")).toEqual("");
    expect(checkAccessDomain("*.0612-10.chenrf.com")).toEqual("");
    expect(checkAccessDomain("*.testsp5.com,abc*.test.com")).toEqual("");
    expect(checkAccessDomain("*.accessdomainEh.com")).toEqual("");
    expect(checkAccessDomain("*.accessdomainDC.com")).toEqual("");
    expect(checkAccessDomain("domain1.com,ds.com,kk.com,*.mw.com")).toEqual("");
    expect(checkAccessDomain("*.fdf.com")).toEqual("");
    expect(checkAccessDomain("*.access.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess20.com")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess21.com")).toEqual("");
    expect(checkAccessDomain("new*.domain.com")).toEqual("");
    expect(checkAccessDomain("*new.dsdw.com")).toEqual("");
    expect(checkAccessDomain("*443.com")).toEqual("");
    expect(checkAccessDomain("*.er3-erwe23.de.com")).toEqual("");
    expect(checkAccessDomain("aaa.domain1.com,*.domain2.com,sub*.domain3.com,*sub.domain4.com")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499938464846.int")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499938489244.com")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499938513147.it")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499942731021.com")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499942757101.int")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499942782402.tv")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499949948398.one")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499949980262.in")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499950004064.one")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499952511247.int")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499952535011.tel")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499952565403.onl")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j799.t1499952640311.me")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j799.t1499952667857.biz")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j799.t1499952693448.int")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j802.t1500634634155.uk")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j802.t1500634660999.net")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j802.t1500634685908.pro")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j802.t1500634754956.gov")).toEqual("");
    expect(checkAccessDomain("*auto-ui.domain-name.j802.t1500634781358.eu")).toEqual("");
    expect(checkAccessDomain("domain*.auto-ui.domain-name.j802.t1500634805236.tel")).toEqual("");
    expect(checkAccessDomain("*.wlinaccess22.com")).toEqual("");
    expect(checkAccessDomain("*.access.com,test-1.access.com")).toEqual("");
    expect(checkAccessDomain("mydomain3.com,*.mydomains.com")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j806.t1501163036136.onl")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j806.t1501163113529.onl")).toEqual("");
    expect(checkAccessDomain("*.access.com,testRobot-20.access.com")).toEqual("");
    expect(checkAccessDomain("*.sub.com")).toEqual("");
    expect(checkAccessDomain("*.baidu.com:80")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j1231.t1534421697239.int")).toEqual("");
    expect(checkAccessDomain("*.auto-ui.domain-name.j1311.t1534421829014.tv")).toEqual("");
    expect(checkAccessDomain("*.test1018.com")).toEqual("");
    expect(checkAccessDomain("*.test1026.com")).toEqual("");
    expect(checkAccessDomain("*.quantil.com")).toEqual("");
    expect(checkAccessDomain("*.0612-10.chenrf.com")).toEqual("");
  })
}

function testTransTransportData() {
  const strategyObj = {
    "topspeed": "Default",
    "topquick": "High Real-time",
    "uniform": "Big-File",
    "max": "Max",
    "hugeslow": "High Concurrency",
    "interact": "Interactive"
  };
  const strategyList = [];
  Object.keys(strategyObj).forEach(item => {
    strategyList.push({ text: strategyObj[item], value: item })
  })

  function getResult(transport, key) {
    const result = transTransportData(transport, strategyList);
    return result[key].text
  }

  describe('transTransportData tests', () => {
    it('{}', () => {
      expect(getResult({}, 'portReuse')).toEqual('Others');
      expect(getResult({}, 'layerProtocol')).toEqual('TCP');
    });
    it('{portReuse:"ftp"}', () => {
      expect(getResult({ portReuse: 'ftp' }, 'portReuse')).toEqual('FTP');
    });
    it('{portReuse:""}', () => {
      expect(getResult({}, 'portReuse')).toEqual('Others');
    });
    it('{portReuse:"https"}', () => {
      expect(getResult({ portReuse: "https" }, 'portReuse')).toEqual('HTTPS without sni');
    });
    it('{layerProtocol:"2"}', () => {
      expect(getResult({ layerProtocol: '2' }, 'layerProtocol')).toEqual('Both');
    });
    it('{layerProtocol:"0"}', () => {
      expect(getResult({ layerProtocol: '0' }, 'layerProtocol')).toEqual('TCP');
    });
    it('{speedLimit:"10"}', () => {
      expect(getResult({ speedLimit: '10' }, 'speedLimit')).toEqual('10 Mbps');
    });
    it('{transportStrategy:""}', () => {
      expect(getResult({ transportStrategy: '' }, 'transportStrategy')).toEqual('Default');
    });

    it('{transportStrategy:"hugeslow"}', () => {
      expect(getResult({ transportStrategy: 'hugeslow' }, 'transportStrategy')).toEqual('High Concurrency');
    });
  });
}

function testSetPortReuse() {

  function getResult(transport, key) {
    const result = { ...transport };
    setPortReuse(result);
    return result[key];
  }
  describe('setPortReuse tests', () => {
    it('{}', () => {
      expect(getResult({}, 'useStandardPort')).toEqual('');
      expect(getResult({}, 'useFtp')).toEqual(0);
      expect(getResult({}, 'portReuse')).toEqual(undefined);
    });
    it('{portReuse:""}', () => {
      expect(getResult({ portReuse: "" }, 'useStandardPort')).toEqual('');
      expect(getResult({ portReuse: "" }, 'useFtp')).toEqual(0);
    });
    it('{portReuse:"ftp"}', () => {
      expect(getResult({ portReuse: "ftp" }, 'useStandardPort')).toEqual('');
      expect(getResult({ portReuse: "ftp" }, 'useFtp')).toEqual(1);
    });
    it('{portReuse:"http"}', () => {
      expect(getResult({ portReuse: "http" }, 'useStandardPort')).toEqual('http');
      expect(getResult({ portReuse: "http" }, 'useFtp')).toEqual(0);
    });
  });
}

function testSetUseUdp() {

  function getResult(transport, key) {
    const result = { ...transport };
    setUseUdp(result);
    return result[key];
  }
  describe('setUseUdp tests', () => {
    it('{}', () => {
      expect(getResult({}, 'useUdp')).toEqual(0);
      expect(getResult({}, 'bothProtocol')).toEqual(undefined);
      expect(getResult({}, 'layerProtocol')).toEqual(undefined);
    });
    it('{layerProtocol:0}', () => {
      expect(getResult({ layerProtocol: 0 }, 'useUdp')).toEqual(0);
      expect(getResult({ layerProtocol: 0 }, 'bothProtocol')).toEqual(undefined);
    });
    it('{layerProtocol:1}', () => {
      expect(getResult({ layerProtocol: 1 }, 'useUdp')).toEqual(1);
      expect(getResult({ layerProtocol: 1 }, 'bothProtocol')).toEqual(undefined);
    });
    it('{layerProtocol:2}', () => {
      expect(getResult({ layerProtocol: 2 }, 'useUdp')).toEqual(0);
      expect(getResult({ layerProtocol: 2 }, 'bothProtocol')).toEqual(1);
      expect(getResult({ layerProtocol: 2 }, 'layerProtocol')).toEqual(undefined);
    });
  });
}

function testIsPortReuseChange() {
  describe('isPortReuseChange tests', () => {
    // false
    it('"",""', () => {
      expect(isPortReuseChange("", "")).toEqual(false);
    });
    it('"","ftp"', () => {
      expect(isPortReuseChange("", "ftp")).toEqual(false);
    });
    it('"http","sni"', () => {
      expect(isPortReuseChange("http", "sni")).toEqual(false);
    });
    // true
    it('"","sni"', () => {
      expect(isPortReuseChange("", "sni")).toEqual(true);
    });
    it('"ftp","http"', () => {
      expect(isPortReuseChange("ftp", "http")).toEqual(true);
    });
  });
}

function testGetIsPortReuse() {
  describe('getIsPortReuse tests', () => {
    // false
    it('""', () => {
      expect(getIsPortReuse("")).toEqual(false);
    });
    it('"ftp"', () => {
      expect(getIsPortReuse("ftp")).toEqual(false);
    });

    // true
    it('"http"', () => {
      expect(getIsPortReuse("http")).toEqual(true);
    });
    it('"sni"', () => {
      expect(getIsPortReuse("sni")).toEqual(true);
    });
    it('"https"', () => {
      expect(getIsPortReuse("https")).toEqual(true);
    });
  });
}

function testDbToFormData() {
  function getResult(transport, key) {
    const result = { ...transport };
    dbToFormData(result);
    return result[key];
  }

  describe('dbToFormData tests', () => {
    {
      const obj = {};
      it(JSON.stringify(obj), () => {
        expect(getResult(obj, 'layerProtocol')).toEqual("0");
        expect(getResult(obj, 'portReuse')).toEqual(' ');
      });
    }

    {
      const obj = { bothProtocol: 0, useUdp: 0, useStandardPort: "", useFtp: "" };
      it(JSON.stringify(obj), () => {
        expect(getResult(obj, 'layerProtocol')).toEqual("0");
        expect(getResult(obj, 'portReuse')).toEqual(' ');
      });
    }

    {
      const obj = { bothProtocol: 0, useUdp: 1, useStandardPort: "", useFtp: "1" };
      it(JSON.stringify(obj), () => {
        expect(getResult(obj, 'layerProtocol')).toEqual("1");
        expect(getResult(obj, 'portReuse')).toEqual('ftp');
      });
    }

    {
      const obj = { bothProtocol: 1, useUdp: 0, useStandardPort: "http", useFtp: "0" };
      it(JSON.stringify(obj), () => {
        expect(getResult(obj, 'layerProtocol')).toEqual("2");
        expect(getResult(obj, 'portReuse')).toEqual('http');
      });
    }

    {
      const obj = { useStandardPort: "sni", useFtp: "0" };
      it(JSON.stringify(obj), () => {
        expect(getResult(obj, 'portReuse')).toEqual('sni');
      });
    }
  });
}

testCheckAccessDomain();
testTransTransportData();
testSetPortReuse();
testSetUseUdp();
testIsPortReuseChange();
testGetIsPortReuse();
testDbToFormData();