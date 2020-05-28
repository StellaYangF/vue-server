const Router = require('@koa/router');
const { getSlider, getCaptcha } = require('../controller/publicController');

const router = new Router({ prefix: '/public' });

router.get('/getSlider', getSlider);
router.get('/getCaptcha', getCaptcha);

module.exports = router;