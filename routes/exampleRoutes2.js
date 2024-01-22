const Router = require('../Core/Router');
const exampleController2 = require('../controller/exampleController2')
const router = new Router();

router.get('/exampleRouter2Uri', exampleController2.exampleController2Function1);
router.post('/exampleRouter2Uri', exampleController2.exampleController2Function2);

module.exports = router;