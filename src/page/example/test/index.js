import connector from 'weappx-weapp';

Page(
  connector.connectPage({
    // preloadObj: state => state.preload.preloadObj,
  })({
    data: {},
    async onLoad() {
      const ret = await getApp().preload;
      if (ret && ret.data) {
        this.setData({
          name: ret.data.name,
          list: ret.data.children,
        });
      }
    },
    onUnload() {
      getApp().preload = null;
    },
  })
);
