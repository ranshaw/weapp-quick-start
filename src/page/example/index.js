// import debounce from 'lodash/debounce';
import { connectPage } from 'weappx-weapp';
// import store from '../../models/example/store';
import { navList } from './services/index';
import { throttle } from '../../utils/util';
import create from '../../utils/create';
import store from '../../globalStore';

create.Page({
  store: {
    emitter: create.emitter,
  },
  data: {
    inputValue: 2,
    isShow: true,
    count: 0,
  },
  inputChange({ detail: { value } }) {
    console.log(value);
    this.setData({
      inputValue: Number(value) || 0,
    });
  },
  plus() {
    const { inputValue } = this.data;
    this.oData.count++;
  },
  sub() {
    const { inputValue } = this.data;
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
    const ret = await navList();
    console.log('ret', ret);
    console.log('preload', this.data.preloadObj);

    // 监听子组件事件
    this.store.emitter.on('plus', this.plus);
    this.store.emitter.on('subtract', this.sub);
  },
});
