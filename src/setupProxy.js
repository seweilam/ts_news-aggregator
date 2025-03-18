const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/newsapi',
    createProxyMiddleware({
      target: 'https://newsapi.org/v2',
      changeOrigin: true,
      pathRewrite: {
        '^/newsapi': '',
      },
      onProxyReq: (proxyReq) => {
        // Add any necessary headers here
      },
    })
  );

  app.use(
    '/guardian',
    createProxyMiddleware({
      target: 'https://content.guardianapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/guardian': '',
      },
      onProxyReq: (proxyReq) => {
        // Add any necessary headers here
      },
    })
  );

  app.use(
    '/nyt',
    createProxyMiddleware({
      target: 'https://api.nytimes.com/svc/search/v2',
      changeOrigin: true,
      pathRewrite: {
        '^/nyt': '',
      },
      onProxyReq: (proxyReq) => {
        // Add any necessary headers here
      },
    })
  );
}; 