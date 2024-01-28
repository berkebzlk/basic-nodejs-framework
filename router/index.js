const Router = require('../Core/Router');
const router = new Router();
const userController = require('../controller/index')

// router application level middleware
router.use((req, res, next) => {console.log('userRouter middleware'); next()})

// router.get(uri, controller) 
router.get('/index2', userController.indexController);

// router.get(uri, middlewares, controller)
router.get('/index1',(req, res, next) => {console.log('user controller öncesi mid'); next()}, userController.indexController);

module.exports = router;