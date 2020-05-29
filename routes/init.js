const Router = require('@koa/router');
const { init } = require('../controller/initController');

const router = new Router();

router.get('/init', init);

module.exports = router;