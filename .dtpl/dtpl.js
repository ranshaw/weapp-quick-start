var path = require('path');

module.exports = function(source) {
  return {
    templates: [
      {
        // 当在 pages 目录下新建一个文件夹时，向这个文件夹内注入 .dtpl/page 下的文件
        matches: function() {
          return source.isDirectory && /^pages?$/.test(source.basicData.dirName);
        },
        name: './page',
        inject: function() {
          let { rawModuleName, dirName, dirPath } = source.basicData;
          let page = [dirName, rawModuleName, rawModuleName].join('/');

          // 向 app.cjson 中注入内容
          let appJson = path.resolve(dirPath, '..', 'app.cjson');

          return [
            { file: appJson, data: { page: '"' + page + '",' }, tags: 'loose', append: true },
          ];
        },
      },
      {
        // 当在 components 目录下新建一个文件夹时，向这个文件夹内注入 .dtpl/component 下的文件
        matches: function() {
          return source.isDirectory && /^components?$/.test(source.basicData.dirName);
        },
        name: './component/',
      },
      {
        // 当在 components 目录下新建一个文件夹时，向这个文件夹内注入 .dtpl/component 下的文件
        matches: function() {
          return source.isDirectory && 'page/**/*';
        },
        name: './services/',
      },
    ],
    globalData: {
      dollar: '$',
      style: 'less',
    },
  };
};
