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
        id: 'wheel',
        sub: 'wheel',
        name: '大转盘',
      },
      {
        id: 'scratch',
        sub: 'scratch',
        name: '刮刮乐',
      },
      {
        id: 'slotMachine',
        sub: 'slotMachine',
        name: '老虎机',
      },
      {
        id: 'fruitMachine',
        sub: 'fruitMachine',
        name: '水果机',
      },
      {
        id: 'gridcard',
        sub: 'gridcard',
        name: '九宫格翻纸牌',
      },
      {
        id: 'shake',
        sub: 'shake',
        name: '摇一摇',
      },
      {
        id: 'gestureLock',
        sub: 'gestureLock',
        name: '手势解锁',
      },
    ],
  },
});
