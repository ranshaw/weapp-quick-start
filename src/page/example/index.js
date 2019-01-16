// import debounce from 'lodash/debounce';
import { connectPage } from 'weappx-weapp';
// import store from '../../models/example/store';
import { navList } from './services/index';
import { throttle } from '/utils/util';
import create from '/utils/create';
import store from '/page/globalStore';
import { countdownTimer } from '../../utils/util';

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
});
