module.exports = {
  '/api/hello-world'(req, res) {
    res.end(`hello-world ${new Date().toString()}`);
  },

  'GET /api/users': {
    code: 'S000000',
    data: [1, 2],
    message: '请求成功',
  },

  'POST /api/users/create': (req, res) => {
    res.end('success');
  },
};
