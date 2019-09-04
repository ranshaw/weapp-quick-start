var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convertLength(length) {
  return Math.round((wx.getSystemInfoSync().windowWidth * length) / 750);
}

function barc(id, code, width, height) {
  barcode.code128(wx.createCanvasContext(id), code, convertLength(width), convertLength(height));
}

function qrc(id, code, width, height) {
  qrcode.api.draw(code, {
    ctx: wx.createCanvasContext(id),
    width: convertLength(width),
    height: convertLength(height),
  });
}
export default {
  barcode: barc,
  qrcode: qrc,
};

export { barc as barcode, qrc as qrcode };
