let publicRouter =  require('./publicRouter');
let userRouter = require('./userRouter');
// let init = require('./init');
let combineRoutes = require('koa-combine-routers');

module.exports = combineRoutes(publicRouter, userRouter);