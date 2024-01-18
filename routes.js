const Router = require('./Router')
const functions = require('./controller/functions')

const router = new Router();
router.get("/berke", functions.example);

module.exports = router;