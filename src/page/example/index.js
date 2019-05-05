// import debounce from 'lodash/debounce';
// import store from '../../models/example/store';
import { navList } from './services/index';
import { throttle, countdownTimer } from '/utils/util';
import create from '/utils/create';
// import store from '/page/globalStore';
import 'minapp';
create.Page({
  store: {
    emitter: create.emitter,
  },
  data: {
    inputValue: 2,
    isShow: true,
    count: 0,
    urls: ['https://img.soufunimg.com/news/2017_09/10/home/1505027168277_000.jpg'],
    days: '00',
    hours: '00',
    minutes: '11',
    seconds: '00',
    isShowPickerView: false,
    pickerViewData: {
      mode: 'selector',
      pickerValue: [0],
      pickerValueSingleArray: [
        {
          id: '1',
          name: '测试1',
        },
        {
          id: '2',
          name: '测试2',
        },
        {
          id: '3',
          name: '测试3',
        },
      ],
    },
  },
  inputChange({ detail: { value } }) {
    console.log(value);
    this.setData({
      inputValue: Number(value) || 0,
    });
  },
  plus() {
    this.oData.count++;
  },
  sub() {
    this.oData.count--;
  },
  toLogin: throttle(function(e) {
    console.log('app数据', getApp());
    getApp().preload = navList({
      grade: '1',
      id: '993746414007906305',
    });
    console.log('eee', e);
  }),
  isShowFn() {
    this.setData({
      isShow: !this.data.isShow,
    });
  },
  async onLoad() {
    console.log('加载页面', this.store);
    // const ret = await navList();
    // console.log('ret', ret);
    // console.log('preload', this.data.preloadObj);

    // 监听子组件事件
    this.store.emitter.on('plus', this.plus);
    this.store.emitter.on('subtract', this.sub);
    this.store.emitter.on('hidePackerView', this.hidePackerView);
    this.store.emitter.on('getChooseValue', this.getChooseValue);

    // 倒计时
    // this.countdownTimer();
  },
  handlePreview() {
    console.log('urls', this.data.urls);
    // 图片只能使用网络地址
    wx.previewImage({
      current: '0', // 当前显示图片的http链接
      urls: this.data.urls, // 需要预览的图片http链接列表
    });
  },
  countdownTimer() {
    countdownTimer.call(this);
  },
  hidePackerView() {
    this.oData.isShowPickerView = false;
  },
  showPickerView() {
    this.oData.isShowPickerView = true;
  },
  getChooseValue(e) {
    console.log('选中的值---', e);
    this.hidePackerView();
    this.setData({
      'pickerViewData.pickerValue': e || [0],
    });
  },
});
