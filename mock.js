module.exports = {
  '/api/hello-world'(req, res) {
    // const { query, body } = req;
    res.status(200).json({
      code: 'S000000',
      data: {
        test: '11111',
      },
      msg: '请求成功！',
    });
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
