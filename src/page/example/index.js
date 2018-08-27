// import debounce from 'lodash/debounce';
import { connectPage } from 'weappx-weapp';
import store from '../../models/example/store';
import { navList } from '../../services/example/index';
import { throttle } from '../../utils/util';

Page(
  connectPage({
    count: state => state.count.count,
  })({
    store,
    data: {
      inputValue: 1,
      isShow: true,
    },
    inputChange({ detail: { value } }) {
      console.log(value);
      this.setData({
        inputValue: Number(value) || 0,
      });
    },
    plus() {
      const { inputValue } = this.data;
      store.dispatcher.count.plus(inputValue);
    },
    sub() {
      const { inputValue } = this.data;
      store.dispatcher.count.sub(inputValue);
    },
    toLogin: throttle(function(e) {
      console.log('app数据', getApp());
      getApp().preload = navList({
        grade: '1',
        id: '993746414007906305',
      });
      console.log('eee', e);
      wx.navigateTo({
        url: '/page/example/test/index',
      });
    }),
    isShowFn() {
      this.setData({
        isShow: !this.data.isShow,
      });
    },
    async onLoad() {
      console.log('加载页面');
      const ret = await navList();
      console.log('ret', ret);
      console.log('preload', this.data.preloadObj);
    },
  })
);
