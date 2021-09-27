const proxy = require('http-proxy-middleware');

module.exports= function(app){
    app.use(
        '/api',
        proxy({
            // 프론트에서 줄 때 target을 5000번 포트로 주겠다는 의미!!
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );
};