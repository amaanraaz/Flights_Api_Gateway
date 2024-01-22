const express = require('express');
const {rateLimit}  = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes).
});
app.use(limiter);

app.use('/flightService', createProxyMiddleware({ target: 'http://localhost:3000/', changeOrigin: true }));
app.use('/bookingService', createProxyMiddleware({ target: 'http://localhost:4000/', changeOrigin: true }));


app.use('/api', apiRoutes);
app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
