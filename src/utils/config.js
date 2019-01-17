module.exports = {
  env: 'mock', // 1. mock 采用模拟数据 2. dev 测试环境 3. prod 生产环境
  constant: {
    codeSuccess: 'S000000',
    imgUrl: 'http://brcshop-pic.oss-cn-shanghai.aliyuncs.com/wx-gift/',
  },
  api: {
    // 模拟数据接口路径,后面直接改为真实路径
    index: {
      users: '/api/users',
    },
  },
};
