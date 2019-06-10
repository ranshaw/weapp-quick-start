import create from '/utils/create';
/*
https://github.com/MPComponent/mpvue-picker
时间选择，日期选择，多列选择，二级联动，三级联动，参考上面项目
*/
create.Component({
  properties: {
    pickerValue: {
      type: Array,
      value: [],
    },
    pickerValueSingleArray: {
      type: Array,
      value: [],
    },
    mode: {
      type: String,
      value: 'selector',
    },
    multipleList: {
      type: Array,
      value: [],
    },
  },
  data: {
    isShow: false,
  },
  ready() {
    console.log('Picker---', this.properties);
    this.showSinglePicker();
  },
  moved() {
    this.store.emitter.off('showPicker');
  },
  methods: {
    showSinglePicker() {
      this.oData.isShow = true;
      this.isStart = false;
      this.isConfirm = false;
    },
    hidePicker() {
      this.store.emitter.emit('hidePackerView', 'cancel');
    },
    confirm(e) {
      /*
      1. 未滚动。2，滚动了，未切换数据。3，滚动了切换了数据
      */
      console.log('this.timer----', this.timer, this.isConfirm);
      if (this.isConfirm) {
        return;
      }
      this.isConfirm = true;
      if (this.isStart) {
        // 滚动了，切换了数据
        this.timer = setInterval(() => {
          console.log('a', this.current);
          if (this.isEnd) {
            console.log('11111111');
            this.isConfirm = false;
            this.store.emitter.emit('getChooseValue', this.current);

            clearInterval(this.timer);
          }
        }, 10);
      } else {
        console.log('22222222');
        this.store.emitter.emit('getChooseValue', this.current);
      }
    },
    pickerChange(e) {
      console.log('e----', e.detail.value);
      this.current = e.detail.value;
    },
    handleItem(e) {
      this.store.emitter.emit('getMultiple', e.currentTarget.dataset.index);
    },
    pickerViewStart(e) {
      console.log('start----', e);
      this.isStart = true;
    },
    pickerViewEnd(e) {
      console.log('end---', e);
      this.isEnd = true;
    },
  },
});
