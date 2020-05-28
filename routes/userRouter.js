const Router = require('@koa/router');
const userController = require('../controller/userController');

const router = new Router({ prefix: '/user' });
router.post('/login', userController.login);
router.post('/reg', userController.reg);
router.post('/validate', userController.validate);
router.post('/sendEmail', userController.sendEmail);
router.post('/codeValidate', userController.codeValidate);
router.post('/changePassword', userController.changePassword);

module.exports = router;