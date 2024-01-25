const Router = require('../Core/Router');
const router = new Router();
const userController = require('../controller/index')

router.get('/index', userController.indexController);

module.exports = router;