const Router = require('../Core/Router');
const exampleController1 = require('../controller/exampleController1')
const router = new Router();

router.get('/exampleRouter1Uri', exampleController1.exampleController1Function1);
router.post('/exampleRouter1Uri', exampleController1.exampleController1Function2);

module.exports = router;