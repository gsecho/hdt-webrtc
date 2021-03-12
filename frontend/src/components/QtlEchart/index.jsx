import React, { PureComponent } from 'react';
import * as echarts from 'echarts';
import 'echarts/map/js/world';
import lodash from 'lodash';

// 唯一标记
const unique = [];

export default class QtlEchart extends PureComponent {

  componentDidMount() {
    this.initGraph();
  }

  // 执行更新动作
  componentDidUpdate(prevProps, prevState) {
    let type = this.props.graphType ? this.props.graphType : 'line';

    if (this.compareGraphOptions(type, prevProps.options, this.props.options) ||
      prevProps.virDom !== this.props.virDom) {
      const { options } = this.props;
      const graph = this.graph;
      graph.clear();
      if (type === 'map') {
        // map类型，进行合并，解决地图移动/缩放时的坐标点偏移bug
        graph.setOption(options, false, true);
      } else {
        // 非map类型，不进行合并，解决数据为空时出现渲染异常bug
        graph.setOption(options, true, true);

      }
    }
  }

  componentWillUnmount() {
    const { virDom } = this.props;
    if (unique.indexOf(virDom) === -1) {
      // 清除状态
      this.setState({});
      // 清除标记
      unique.splice(unique.findIndex(item => item === virDom), 1);
      // 移除监听事件
      window.removeEventListener('resize', this.graphResize);
    }

    // 销毁
    this.graph.clear();
    this.graph.dispose();
  };

  // 初始化图表
  initGraph = () => {
    const { virDom } = this.props;
    const { graphType, options } = this.props;
    this.graph = echarts.init(this[virDom], 'light');
    const graph = this.graph;

    if (graphType === 'map') {
      // map类型，进行合并，解决地图移动/缩放时的坐标点偏移bug
      graph.setOption(options, false, true);
    } else {
      // 非map类型，不进行合并，解决数据为空时出现渲染异常bug
      graph.setOption(options, true, true);
    }
    // 添加监听事件,为防止多次添加，需要进行判断
    if (unique.indexOf(virDom) === -1) {
      unique.push(virDom);
      window.addEventListener('resize', this.graphResize, false);
      // window.addEventListener('resize', this.graphResize);
    }
    // 为图表绑定事件
    if (this.props.eventTrigger && this.props.eventListener) {
      // TODO：判断参数类型
      if (lodash.isArray(this.props.eventTrigger) && lodash.isArray(this.props.eventListener)) {
        // 数组，依次监听事件
        let len = this.props.eventTrigger.length;
        for (let i = 0; i < len; i++) {
          let triggerItem = this.props.eventTrigger[i];
          let listenerItem = this.props.eventListener[i];
          graph.on(triggerItem, listenerItem);
        }
      } else {
        // 当作字符串处理
        graph.on(this.props.eventTrigger, this.props.eventListener);
      }
    }
    // setOption(option, notMerge, lazyUpdate)
    // notMerge, 是否不跟之前设置的 option 进行合并，默认为 false，即合并
    // lazyUpdate, 在设置完 option 后是否不立即更新图表，默认为 false，即立即更新

  };

  // 自适应容器
  graphResize = () => {
    const { virDom } = this.props;
    if (virDom && this[virDom]) {
      // TODO：world触发resize时会报错，只能暂时先用try catch处理
      try {
        this.graph.resize();
      } catch (e) {

      }
    }
  };

  /**
   * 比较图表数据是否发生了变化
   * @param type           图表类型
   * @param prevData       变化前数据
   * @param nextData       变化后数据
   * @returns {boolean}    false 表示没有变化，true 表示发生变化
   */
  compareGraphOptions = (type = '', prevData = {}, nextData = {}) => {
    let res = false;

    let pData = [];
    let nData = [];

    switch (type) {
      // 地图
      case 'map':
        // TODO: 优化
        let len = prevData.series.length;
        for (let i = 0; i < len; i++) {
          pData = prevData.series[i].data;
          nData = nextData.series[i].data;
          if (!lodash.isEqual(pData, nData)) {
            res = true;
            break;
          }
        }
        break;
      // 折线图
      case 'line':
        pData = prevData.series;
        nData = nextData.series;
        if (!lodash.isEqual(pData, nData)) {
          res = true;
        }
        break;
      default:
        break;
    }

    return res;
  }

  // 导出图表图片，返回一个 base64 的 URL，可以设置为Image的src
  getGraphDataForExport = (options = {}) => {
    let defaultOptions = {
      // // 导出的格式，可选 png, jpeg
      // type: 'png',
      // 导出的图片分辨率比例，默认为 1。
      pixelRatio: 1,
      // 导出的图片背景色，默认使用 option 里的 backgroundColor
      backgroundColor: '#fff',
    };
    options = { ...defaultOptions, ...options };
    const { virDom } = this.props;
    let data = this.graph.getDataURL(options);
    return data;
  };

  render() {
    const { virDom } = this.props;

    return (
      <div style={this.props.styles} ref={(m) => this[virDom] = m}></div>
    );
  }

}
