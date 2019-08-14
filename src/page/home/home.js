// 此文件是由模板文件 ".dtpl/page/home.js.dtpl" 生成的，你可以自行修改模板

// import { test } from './services/index';
import { throttle } from '/utils/util';
import create from '/utils/create';
import store from '/page/globalStore';
import 'minapp';

create.Page({
  store,
  data: {
    list: [
      {
        id: 'market',
        sub: 'market',
        name: '营销组件',
        url: 'https://ranshaw.oss-cn-shanghai.aliyuncs.com/example/market.png',
      },
      {
        id: 'PopUp',
        sub: 'PopUp',
        name: 'Popup 弹出层',
        url: 'https://ranshaw.oss-cn-shanghai.aliyuncs.com/example/pop-code.png',
      },
    ],
  },
});
