// setupProxy.js
 
const { createProxyMiddleware } = require('http-proxy-middleware');
 
module.exports = function (app) {
  app.use(
    '/api',  // 这里设置代理的路径，可以根据你的实际需求进行修改
    createProxyMiddleware({
      target: 'https://api.tripo3d.ai/v2/openapi',  // 设置代理目标服务器的地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',  // 重写路径，如果你的API路径有前缀，可以在这里去掉
      },
    })
  );
};